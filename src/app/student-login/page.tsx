'use client'

import React, { useState } from 'react'
import { BookOpen, ArrowLeft, User, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sanitizeInput, validateClassName } from '@/lib/utils'
import { NIGERIAN_CLASSES } from '@/lib/types/database'

export default function StudentLoginPage() {
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [className, setClassName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simple form submit handler for login
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const sanitizedFullName = sanitizeInput(fullName.trim())
    const sanitizedClassName = className.trim()

    if (!sanitizedFullName) {
      setError('Please enter your full name.')
      return
    }

    if (!validateClassName(sanitizedClassName)) {
      setError('Please select a valid class.')
      return
    }

    setIsLoading(true)

    try {
      // Query student in DB by full name and class
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('full_name', sanitizedFullName)
        .eq('class', sanitizedClassName)
        .single()

      if (fetchError || !data) {
        setError('Student not found. Please check your credentials.')
        setIsLoading(false)
        return
      }

      if (data.has_submitted) {
        setError('You have already submitted the exam and cannot retake it.')
        setIsLoading(false)
        return
      }

      // Save student info in localStorage or cookie for session (simplified here)
      localStorage.setItem('currentStudent', JSON.stringify(data))

      // Redirect to exam start page (adjust route as needed)
      window.location.href = '/exam/start'
    } catch (err) {
      setError('Login failed. Please try again later.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        aria-label="Go back"
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="mb-6 text-center">
        <BookOpen className="mx-auto h-10 w-10 text-green-600" />
        <h1 className="text-2xl font-bold mt-2">Student Exam Login</h1>
        <p className="text-gray-600 mt-1">Enter your credentials to access the exam</p>
      </div>

      {/* Demo Credentials Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
        <div className="text-xs text-blue-800 space-y-1">
          <p>
            <strong>Name:</strong> Adebayo Tunde, <strong>Class:</strong> JSS1A
          </p>
          <p>
            <strong>Name:</strong> Jennifer Akpan, <strong>Class:</strong> SS1A
          </p>
          <p className="pt-1 text-blue-600">More students available in other Nigerian classes</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Class
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="className"
              value={className}
              onChange={e => setClassName(e.target.value)}
              required
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent appearance-none"
            >
              <option value="">Select your class</option>
              <optgroup label="Junior Secondary School (JSS)">
                {NIGERIAN_CLASSES.filter(c => c.class_level === 'JSS').map(classInfo => (
                  <option key={classInfo.class_name} value={classInfo.class_name}>
                    {classInfo.class_name} - {classInfo.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Senior Secondary School (SS)">
                {NIGERIAN_CLASSES.filter(c => c.class_level === 'SS').map(classInfo => (
                  <option key={classInfo.class_name} value={classInfo.class_name}>
                    {classInfo.class_name} - {classInfo.description}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Available Classes Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Available Classes</h3>
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
          <div>
            <strong>JSS:</strong>
            <div>JSS1A, JSS1B</div>
            <div>JSS2A, JSS3A</div>
          </div>
          <div>
            <strong>SS:</strong>
            <div>SS1A, SS1B</div>
            <div>SS2A, SS3A</div>
          </div>
          <div>
            <strong>Subjects:</strong>
            <div>Mathematics</div>
            <div>English, Biology</div>
            <div>Chemistry, Physics</div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-sm font-medium text-yellow-800 mb-1">Security Notice</h3>
        <p className="text-xs text-yellow-700">
          This exam has anti-cheat protection. Tab switching, copy-paste, and other violations will be monitored.
        </p>
      </div>
    </div>
  )
}
