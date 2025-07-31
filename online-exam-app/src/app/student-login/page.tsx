'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ArrowLeft, User, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sanitizeInput, validateClassName } from '@/lib/utils'

export default function StudentLoginPage() {
  const [fullName, setFullName] = useState('')
  const [className, setClassName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (!fullName.trim() || !className.trim()) {
      setError('Please fill in both fields')
      setIsLoading(false)
      return
    }

    if (!validateClassName(className)) {
      setError('Invalid class format')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Sanitize inputs
      const sanitizedName = sanitizeInput(fullName)
      const sanitizedClass = sanitizeInput(className)

      // Check if student exists and hasn't submitted yet
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('full_name', sanitizedName)
        .eq('class', sanitizedClass)
        .single()

      if (studentError || !student) {
        setError('Incorrect credentials. Please check your name and class.')
        setIsLoading(false)
        return
      }

      if (student.has_submitted) {
        setError('You have already submitted your exam.')
        setIsLoading(false)
        return
      }

      // Store student info in localStorage for this session
      localStorage.setItem('currentStudent', JSON.stringify(student))
      
      // Redirect to exam instructions
      router.push('/exam/instructions')
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-blue-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Login</h1>
            <p className="text-gray-600">Enter your credentials to access the exam</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your class (e.g., 10A, Grade-12)"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Continue to Exam'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Security Notice</h3>
            <p className="text-xs text-yellow-700">
              This exam has anti-cheat protection. Tab switching, copy-paste, and other violations will be monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}