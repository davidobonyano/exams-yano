'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { useExamStore } from '@/lib/store/exam-store'
import { useAntiCheat } from '@/lib/hooks/useAntiCheat'
import { createClient } from '@/lib/supabase/client'
import { formatTime, shuffleArray } from '@/lib/utils'
import type { Student, Question, ExamSession } from '@/lib/types/database'

// Mock questions for demo - in real app these would come from database
const mockQuestions: Question[] = [
  {
    id: '1',
    class: 'Demo Class',
    question_text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct_answer: 2,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    class: 'Demo Class',
    question_text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct_answer: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    class: 'Demo Class',
    question_text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct_answer: 1,
    created_at: new Date().toISOString()
  }
]

export default function ExamStartPage() {
  const router = useRouter()
  const {
    currentSession,
    student,
    questions,
    answers,
    currentQuestionIndex,
    timeRemaining,
    isExamActive,
    startExam,
    setAnswer,
    nextQuestion,
    previousQuestion,
    updateTimeRemaining,
    endExam,
    resetExam
  } = useExamStore()

  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')

  // Timer effect
  useEffect(() => {
    if (!isExamActive || timeRemaining <= 0) return

    const timer = setInterval(() => {
      updateTimeRemaining(timeRemaining - 1)
      
      if (timeRemaining <= 1) {
        handleSubmitExam()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, isExamActive, updateTimeRemaining])

  // Handle violation warnings
  const handleViolation = useCallback((reason: string) => {
    setWarningMessage(reason)
    setShowWarning(true)
    setTimeout(() => setShowWarning(false), 3000)
  }, [])

  // Handle forced submission due to cheating
  const handleForceSubmit = useCallback(() => {
    alert('Multiple violations detected. Exam will be submitted automatically.')
    handleSubmitExam()
  }, [])

  // Anti-cheat hook
  const { violationCount } = useAntiCheat({
    onViolation: handleViolation,
    onForceSubmit: handleForceSubmit,
    maxViolations: 2
  })

  // Initialize exam
  useEffect(() => {
    const initializeExam = async () => {
      try {
        const studentData = localStorage.getItem('currentStudent')
        if (!studentData) {
          router.push('/student-login')
          return
        }

        const parsedStudent: Student = JSON.parse(studentData)

        // Check if exam already started
        if (currentSession && student) {
          setIsLoading(false)
          return
        }

        // In a real app, fetch questions from database based on student's class
        const shuffledQuestions = shuffleArray(mockQuestions)

        // Create exam session
        const session: ExamSession = {
          id: `session_${Date.now()}`,
          student_id: parsedStudent.id,
          class: parsedStudent.class,
          questions_order: shuffledQuestions.map(q => q.id),
          started_at: new Date().toISOString(),
          time_limit: 60, // 60 minutes
          current_question_index: 0
        }

        startExam(session, parsedStudent, shuffledQuestions)
      } catch (error) {
        console.error('Error initializing exam:', error)
        router.push('/student-login')
      } finally {
        setIsLoading(false)
      }
    }

    initializeExam()
  }, [currentSession, student, startExam, router])

  // Update selected answer when question changes
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion) {
      setSelectedAnswer(answers[currentQuestion.id] ?? null)
    }
  }, [currentQuestionIndex, questions, answers])

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion) {
      setSelectedAnswer(answerIndex)
      setAnswer(currentQuestion.id, answerIndex)
    }
  }

  const handleSubmitExam = async () => {
    if (!student || !currentSession) return

    try {
      endExam()
      
      // Calculate score
      let score = 0
      const totalQuestions = questions.length
      
      questions.forEach(question => {
        const studentAnswer = answers[question.id]
        if (studentAnswer === question.correct_answer) {
          score++
        }
      })

      // In a real app, save results to database
      const result = {
        student_id: student.id,
        class: student.class,
        answers,
        score,
        total_questions: totalQuestions,
        timestamp: new Date().toISOString(),
        cheating_flags: useExamStore.getState().cheatingAttempts,
        time_taken: (currentSession.time_limit * 60) - timeRemaining
      }

      console.log('Exam result:', result)

      // Mark student as submitted in database
      const supabase = createClient()
      await supabase
        .from('students')
        .update({ has_submitted: true })
        .eq('id', student.id)

      // Clear exam data
      resetExam()
      localStorage.removeItem('currentStudent')
      
      // Redirect to results
      router.push(`/exam/results?score=${score}&total=${totalQuestions}`)
    } catch (error) {
      console.error('Error submitting exam:', error)
      alert('Error submitting exam. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  if (!student || !currentSession || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading exam. Please restart.</p>
          <button 
            onClick={() => router.push('/student-login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Banner */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center z-50">
          <div className="flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Warning: {warningMessage} ({violationCount}/2 violations)</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-white shadow-sm border-b ${showWarning ? 'mt-12' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Exam in Progress</h1>
              <p className="text-sm text-gray-600">{student.full_name} • {student.class}</p>
            </div>
            
            {/* Timer */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <div className="flex space-x-4">
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Submit Exam
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}