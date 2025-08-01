import Link from 'next/link'
import { BookOpen, Users, Shield, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">SecureExam</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A secure, anti-cheat online examination platform for educational institutions
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Shield className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Anti-Cheat Protection</h3>
            <p className="text-gray-600">
              Advanced monitoring system detects tab switching, copy-paste attempts, and other cheating behaviors
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Clock className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Time Management</h3>
            <p className="text-gray-600">
              Automated timer with auto-submission when time expires to ensure fair examination conditions
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Users className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-600">
              Separate dashboards for students, teachers, and administrators with appropriate permissions
            </p>
          </div>
        </div>

        {/* Login Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Choose Your Role</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Student Login */}
            <Link href="/student-login" className="group">
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-blue-500">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-10 w-10 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Student</h3>
                  <p className="text-gray-600 mb-4">Take your exam with your name and class</p>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-md group-hover:bg-blue-700 transition-colors">
                    Start Exam
                  </div>
                </div>
              </div>
            </Link>

            {/* Teacher Login */}
            <Link href="/teacher-login" className="group">
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-green-500">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Users className="h-10 w-10 text-green-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Teacher</h3>
                  <p className="text-gray-600 mb-4">Manage classes and view student results</p>
                  <div className="bg-green-600 text-white px-4 py-2 rounded-md group-hover:bg-green-700 transition-colors">
                    Teacher Portal
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Login */}
            <Link href="/admin-login" className="group">
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-purple-500">
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Shield className="h-10 w-10 text-purple-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Administrator</h3>
                  <p className="text-gray-600 mb-4">System administration and user management</p>
                  <div className="bg-purple-600 text-white px-4 py-2 rounded-md group-hover:bg-purple-700 transition-colors">
                    Admin Panel
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Built with Next.js, Tailwind CSS, TypeScript, and Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
