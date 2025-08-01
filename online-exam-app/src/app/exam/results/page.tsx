'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Award, Clock, Home } from 'lucide-react'

export default function ExamResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [grade, setGrade] = useState('')

  useEffect(() => {
    const scoreParam = searchParams.get('score')
    const totalParam = searchParams.get('total')

    if (!scoreParam || !totalParam) {
      router.push('/')
      return
    }

    const scoreNum = parseInt(scoreParam)
    const totalNum = parseInt(totalParam)
    const percentageNum = Math.round((scoreNum / totalNum) * 100)

    setScore(scoreNum)
    setTotal(totalNum)
    setPercentage(percentageNum)

    // Calculate grade
    if (percentageNum >= 90) setGrade('A+')
    else if (percentageNum >= 80) setGrade('A')
    else if (percentageNum >= 70) setGrade('B')
    else if (percentageNum >= 60) setGrade('C')
    else if (percentageNum >= 50) setGrade('D')
    else setGrade('F')
  }, [searchParams, router])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-100'
      case 'B':
        return 'text-blue-600 bg-blue-100'
      case 'C':
        return 'text-yellow-600 bg-yellow-100'
      case 'D':
        return 'text-orange-600 bg-orange-100'
      case 'F':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const isPassingGrade = percentage >= 60

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Results Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Success/Failure Icon */}
          <div className="mb-6">
            {isPassingGrade ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isPassingGrade ? 'Congratulations!' : 'Exam Completed'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {isPassingGrade 
              ? 'You have successfully completed the exam.' 
              : 'Your exam has been submitted. Please see your results below.'}
          </p>

          {/* Score Display */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Score */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
              <div className="text-sm text-blue-800">Correct Answers</div>
              <div className="text-xs text-blue-600">out of {total}</div>
            </div>

            {/* Percentage */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{percentage}%</div>
              <div className="text-sm text-indigo-800">Score Percentage</div>
            </div>

            {/* Grade */}
            <div className="rounded-lg p-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold mb-2 ${getGradeColor(grade)}`}>
                {grade}
              </div>
              <div className="text-sm text-gray-800">Final Grade</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className={`p-4 rounded-lg mb-6 ${
            isPassingGrade 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              isPassingGrade ? 'text-green-800' : 'text-red-800'
            }`}>
              {isPassingGrade 
                ? `Excellent work! You scored ${percentage}% and have passed the exam.`
                : `You scored ${percentage}%. Unfortunately, this is below the passing grade of 60%.`}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Exam Status</span>
              </div>
              <p className="text-gray-600">Completed and Submitted</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Attempt</span>
              </div>
              <p className="text-gray-600">1 of 1 (Final)</p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-yellow-800 text-left space-y-1">
              <li>• This is your final submission and cannot be changed</li>
              <li>• Your teacher will receive these results automatically</li>
              <li>• If you have concerns about your results, contact your teacher</li>
              <li>• Keep this page as a record of your performance</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Print Results
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Exam completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}