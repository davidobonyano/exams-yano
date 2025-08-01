'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sanitizeInput } from '@/lib/utils'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields')
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email).toLowerCase()

      // For demo purposes, we'll check against our admins table
      // In production, you would use proper password hashing (bcrypt)
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', sanitizedEmail)
        .eq('is_active', true)
        .single()

      if (adminError || !admin) {
        setError('Invalid email or password')
        setIsLoading(false)
        return
      }

      // For demo, we'll accept any password for these demo accounts
      // In production, use: bcrypt.compare(password, admin.password_hash)
      const validDemoPasswords = ['admin123', 'password', 'demo123']
      if (!validDemoPasswords.includes(password)) {
        setError('Invalid email or password')
        setIsLoading(false)
        return
      }

      // Store admin info in localStorage for this session
      localStorage.setItem('currentAdmin', JSON.stringify({
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }))
      
      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Shield className="h-10 w-10 text-purple-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Administrator Login</h1>
            <p className="text-gray-600">Access the system administration panel</p>
          </div>

          {/* Demo Credentials Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Email:</strong> admin@school.edu.ng</p>
              <p><strong>Password:</strong> admin123</p>
              <p className="pt-1 text-blue-600">Alt: principal@school.edu.ng</p>
            </div>
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Access Admin Panel'}
            </button>
          </form>

          {/* Security Warning */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-medium text-red-900 mb-2">⚠️ Administrative Access</h3>
            <p className="text-xs text-red-800">
              This area is restricted to authorized administrators only. All activities are logged and monitored.
            </p>
          </div>

          {/* Features Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Admin Dashboard Features</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Manage teachers and students</li>
              <li>• System-wide exam analytics</li>
              <li>• Security monitoring and reports</li>
              <li>• Database management tools</li>
              <li>• User role and permission control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}