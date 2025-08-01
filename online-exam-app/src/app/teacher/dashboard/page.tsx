'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Download, 
  Eye,
  AlertTriangle,
  LogOut,
  Plus,
  Filter
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Teacher, ExamResult, Student } from '@/lib/types/database'
import { NIGERIAN_CLASSES, NIGERIAN_SUBJECTS } from '@/lib/types/database'

interface DashboardStats {
  totalStudents: number
  completedExams: number
  averageScore: number
  cheatingIncidents: number
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    completedExams: 0,
    averageScore: 0,
    cheatingIncidents: 0
  })
  const [students, setStudents] = useState<Student[]>([])
  const [examResults, setExamResults] = useState<ExamResult[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if teacher is logged in
    const teacherData = localStorage.getItem('currentTeacher')
    if (!teacherData) {
      router.push('/teacher-login')
      return
    }

    try {
      const parsedTeacher = JSON.parse(teacherData)
      setTeacher(parsedTeacher)
      loadDashboardData(parsedTeacher)
    } catch (error) {
      console.error('Invalid teacher data:', error)
      router.push('/teacher-login')
    }
  }, [router])

  const loadDashboardData = async (teacherData: Teacher) => {
    try {
      const supabase = createClient()

      // Get students from teacher's classes
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .in('class', teacherData.classes)

      // Get exam results for teacher's classes
      const { data: resultsData } = await supabase
        .from('exam_results')
        .select('*')
        .in('class', teacherData.classes)

      setStudents(studentsData || [])
      setExamResults(resultsData || [])

      // Calculate stats
      const completedExams = resultsData?.length || 0
      const totalScore = resultsData?.reduce((sum, result) => sum + result.score, 0) || 0
      const averageScore = completedExams > 0 ? Math.round((totalScore / completedExams) * 100 / (resultsData?.[0]?.total_questions || 1)) : 0
      const cheatingIncidents = resultsData?.filter(result => result.cheating_flags.length > 0).length || 0

      setStats({
        totalStudents: studentsData?.length || 0,
        completedExams,
        averageScore,
        cheatingIncidents
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentTeacher')
    router.push('/')
  }

  const exportResults = () => {
    if (examResults.length === 0) {
      alert('No exam results to export')
      return
    }

    const filteredResults = selectedClass === 'all' 
      ? examResults 
      : examResults.filter(result => result.class === selectedClass)

    const csvContent = [
      ['Student ID', 'Class', 'Subject', 'Score', 'Total Questions', 'Percentage', 'Time Taken', 'Cheating Flags', 'Date'],
      ...filteredResults.map(result => [
        result.student_id,
        result.class,
        result.subject,
        result.score,
        result.total_questions,
        `${Math.round((result.score / result.total_questions) * 100)}%`,
        `${Math.floor(result.time_taken / 60)}:${(result.time_taken % 60).toString().padStart(2, '0')}`,
        result.cheating_flags.join('; '),
        new Date(result.timestamp).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `exam_results_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Authentication required</p>
          <button 
            onClick={() => router.push('/teacher-login')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const filteredResults = selectedClass === 'all' 
    ? examResults 
    : examResults.filter(result => result.class === selectedClass)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">{teacher.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Exams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cheating Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cheatingIncidents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Classes */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">My Classes</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {teacher.classes.map((className) => {
                const classStudents = students.filter(s => s.class === className)
                const classResults = examResults.filter(r => r.class === className)
                
                return (
                  <div key={className} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900">{className}</h3>
                    <p className="text-sm text-gray-600">{classStudents.length} students</p>
                    <p className="text-sm text-gray-600">{classResults.length} exams</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Exam Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Exam Results</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-400 mr-2" />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="all">All Classes</option>
                    {teacher.classes.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={exportResults}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Taken
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No exam results found
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result) => {
                    const percentage = Math.round((result.score / result.total_questions) * 100)
                    const hasCheating = result.cheating_flags.length > 0
                    
                    return (
                      <tr key={result.id} className={hasCheating ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.student_id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-medium ${
                            percentage >= 70 ? 'text-green-600' : 
                            percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.score}/{result.total_questions} ({percentage}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasCheating ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Flagged
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Clean
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}