'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Users, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  AlertTriangle,
  LogOut,
  Eye,
  Download,
  UserPlus,
  Trash2
} from 'lucide-react'
// Update the import path below if your supabase client is in a different location
import { createClient } from '../../../lib/supabase/client'
import type { Admin, Teacher, Student, ExamResult } from '../../../lib/types/database'
import { NIGERIAN_CLASSES } from '../../../lib/types/database'

interface SystemStats {
  totalStudents: number
  totalTeachers: number
  totalExams: number
  systemAverage: number
  cheatingIncidents: number
  activeClasses: number
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [stats, setStats] = useState<SystemStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalExams: 0,
    systemAverage: 0,
    cheatingIncidents: 0,
    activeClasses: 0
  })
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [examResults, setExamResults] = useState<ExamResult[]>([])
  type TabId = 'overview' | 'teachers' | 'students' | 'results'
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('currentAdmin')
    if (!adminData) {
      router.push('/admin-login')
      return
    }

    try {
      const parsedAdmin = JSON.parse(adminData)
      setAdmin(parsedAdmin)
      loadDashboardData()
    } catch (error) {
      console.error('Invalid admin data:', error)
      router.push('/admin-login')
    }
  }, [router])

  const loadDashboardData = async () => {
    try {
      const supabase = createClient()

      // Load all data
      const [teachersData, studentsData, resultsData] = await Promise.all([
        supabase.from('teachers').select('*'),
        supabase.from('students').select('*'),
        supabase.from('exam_results').select('*')
      ])

      setTeachers(teachersData.data || [])
      setStudents(studentsData.data || [])
      setExamResults(resultsData.data || [])

      // Calculate system stats
      const totalExams = resultsData.data?.length || 0
      const totalScore = resultsData.data?.reduce((sum, result) => sum + result.score, 0) || 0
      const totalQuestions = resultsData.data?.reduce((sum, result) => sum + result.total_questions, 0) || 0
      const systemAverage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0
      const cheatingIncidents = resultsData.data?.filter(result => result.cheating_flags.length > 0).length || 0

      // Get unique classes from students
      const uniqueClasses = new Set(studentsData.data?.map(s => s.class) || [])

      setStats({
        totalStudents: studentsData.data?.length || 0,
        totalTeachers: teachersData.data?.filter(t => t.is_active).length || 0,
        totalExams,
        systemAverage,
        cheatingIncidents,
        activeClasses: uniqueClasses.size
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentAdmin')
    router.push('/')
  }

  const exportSystemData = () => {
    // Create comprehensive system export
    const systemReport = {
      generatedAt: new Date().toISOString(),
      stats,
      teachers: teachers.map(t => ({
        name: t.full_name,
        email: t.email,
        classes: t.classes,
        active: t.is_active
      })),
      students: students.map(s => ({
        name: s.full_name,
        class: s.class,
        submitted: s.has_submitted
      })),
      examResults: examResults.map(r => ({
        class: r.class,
        subject: r.subject,
        score: r.score,
        total: r.total_questions,
        percentage: Math.round((r.score / r.total_questions) * 100),
        cheatingFlags: r.cheating_flags.length,
        date: new Date(r.timestamp).toLocaleDateString()
      }))
    }

    const jsonContent = JSON.stringify(systemReport, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `system_report_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Administrative access required</p>
          <button 
            onClick={() => router.push('/admin-login')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{admin.full_name} • {admin.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportSystemData}
                className="flex items-center px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export System Data
              </button>
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
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-500" />
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Students</p>
                <p className="text-lg font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-green-500" />
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Teachers</p>
                <p className="text-lg font-bold text-gray-900">{stats.totalTeachers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-indigo-500" />
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Classes</p>
                <p className="text-lg font-bold text-gray-900">{stats.activeClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-yellow-500" />
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Exams</p>
                <p className="text-lg font-bold text-gray-900">{stats.totalExams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-purple-500" />
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Avg Score</p>
                <p className="text-lg font-bold text-gray-900">{stats.systemAverage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Incidents</p>
                <p className="text-lg font-bold text-gray-900">{stats.cheatingIncidents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'System Overview', icon: BarChart3 },
                { id: 'teachers', name: 'Teachers', icon: GraduationCap },
                { id: 'students', name: 'Students', icon: Users },
                { id: 'results', name: 'Exam Results', icon: BookOpen }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">System Overview</h3>

                {/* Class Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Student Distribution by Class</h4>
                    <div className="space-y-2">
                      {NIGERIAN_CLASSES.slice(0, 10).map((classInfo) => {
                        const count = students.filter(s => s.class === classInfo.class_name).length
                        return (
                          <div key={classInfo.class_name} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                            <span className="font-medium">{classInfo.class_name}</span>
                            <span className="text-gray-600">{count} students</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      {examResults.slice(0, 5).map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{result.class} • {result.subject}</p>
                            <p className="text-xs text-gray-600">
                              Score: {Math.round((result.score / result.total_questions) * 100)}%
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(result.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Teachers Management</h3>
                  <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {teacher.full_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {teacher.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex flex-wrap gap-1">
                              {teacher.classes.map((className) => (
                                <span key={className} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {className}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              teacher.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {teacher.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-purple-600 hover:text-purple-900 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.slice(0, 20).map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.full_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              student.has_submitted 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.has_submitted ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(student.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Exam Results Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900">High Performers</h4>
                    <p className="text-2xl font-bold text-green-700">
                      {examResults.filter(r => (r.score / r.total_questions) >= 0.8).length}
                    </p>
                    <p className="text-sm text-green-600">80%+ scores</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Average Performers</h4>
                    <p className="text-2xl font-bold text-yellow-700">
                      {examResults.filter(r => {
                        const pct = r.score / r.total_questions
                        return pct >= 0.6 && pct < 0.8
                      }).length}
                    </p>
                    <p className="text-sm text-yellow-600">60-79% scores</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-900">Need Attention</h4>
                    <p className="text-2xl font-bold text-red-700">
                      {examResults.filter(r => (r.score / r.total_questions) < 0.6).length}
                    </p>
                    <p className="text-sm text-red-600">Below 60%</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flags</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {examResults.slice(0, 10).map((result) => {
                        const percentage = Math.round((result.score / result.total_questions) * 100)
                        return (
                          <tr key={result.id} className={result.cheating_flags.length > 0 ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.class}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`font-medium ${
                                percentage >= 80 ? 'text-green-600' : 
                                percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.cheating_flags.length > 0 ? (
                                <span className="text-red-600 font-medium">{result.cheating_flags.length}</span>
                              ) : (
                                <span className="text-green-600">0</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}