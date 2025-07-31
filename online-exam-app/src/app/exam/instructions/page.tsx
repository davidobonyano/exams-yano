'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Clock, Shield, Play } from 'lucide-react'
import type { Student } from '@/lib/types/database'

export default function ExamInstructionsPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if student is logged in
    const studentData = localStorage.getItem('currentStudent')
    if (!studentData) {
      router.push('/student-login')
      return
    }

    try {
      const parsedStudent = JSON.parse(studentData)
      setStudent(parsedStudent)
    } catch (error) {
      console.error('Invalid student data:', error)
      router.push('/student-login')
    }
  }, [router])

  const startExam = async () => {
    if (!agreed || !student) return

    setIsLoading(true)
    
    try {
      // Here we would typically create an exam session in the database
      // For now, we'll proceed to the exam page
      router.push('/exam/start')
    } catch (error) {
      console.error('Error starting exam:', error)
      alert('Failed to start exam. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Instructions</h1>
            <p className="text-lg text-gray-600">
              Welcome, <span className="font-semibold text-blue-600">{student.full_name}</span> 
              from <span className="font-semibold text-blue-600">{student.class}</span>
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Important Notice</h3>
              <p className="text-red-700">
                This exam has strict anti-cheating measures. Any violation will result in automatic submission and potential disqualification.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exam Rules & Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Time Rules */}
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time Management</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Exam duration: <strong>60 minutes</strong></li>
                    <li>• Timer starts when you click &ldquo;Start Exam&rdquo;</li>
                    <li>• Auto-submit when time expires</li>
                    <li>• No extensions or retakes allowed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Rules */}
            <div className="space-y-4">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Anti-Cheat Measures</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• No tab switching or window changes</li>
                    <li>• Copy-paste is disabled</li>
                    <li>• Right-click is disabled</li>
                    <li>• Developer tools are blocked</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Format */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">Exam Format</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800">Question Type</p>
                <p className="text-blue-700">Multiple Choice</p>
              </div>
              <div>
                <p className="font-medium text-blue-800">Total Questions</p>
                <p className="text-blue-700">20 Questions</p>
              </div>
              <div>
                <p className="font-medium text-blue-800">Navigation</p>
                <p className="text-blue-700">Previous/Next only</p>
              </div>
            </div>
          </div>

          {/* Violations */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-3">Automatic Submission Triggers</h3>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• Switching to another tab or application more than 2 times</li>
              <li>• Attempting to refresh or navigate away from the page</li>
              <li>• Using keyboard shortcuts to open developer tools</li>
              <li>• Losing page focus for extended periods</li>
            </ul>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agreement" className="ml-3 text-gray-700">
              I have read and understood all the exam instructions and rules. I agree to follow all guidelines and understand that any violation may result in automatic submission and disqualification.
            </label>
          </div>

          <div className="flex justify-center">
            <button
              onClick={startExam}
              disabled={!agreed || isLoading}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Starting Exam...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Exam
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Once you start, you cannot pause or restart the exam
          </p>
        </div>
      </div>
    </div>
  )
}