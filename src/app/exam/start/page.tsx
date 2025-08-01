'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@supabase/supabase-js'
import { shuffleArray, formatTime } from '../../../lib/utils'
import type {
  Student,
  Question,
  ExamSession,
  ExamResult
} from '../../../lib/types/database'

// Simple ID generator (timestamp + random string)
function generateId(prefix: string) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
}

// Demo/mock student for testing
const mockStudent: Student = {
  id: 'student-123',
  full_name: 'John Doe',
  class: 'Demo Class',
  has_submitted: false,
  created_at: new Date().toISOString()
}

// Demo/mock questions fallback
const mockQuestions: Question[] = [
  {
    id: 'q1',
    class: 'Demo Class',
    subject: 'General Knowledge',
    question_text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct_answer: 2,
    created_by: undefined,
    created_at: new Date().toISOString()
  },
  {
    id: 'q2',
    class: 'Demo Class',
    subject: 'General Knowledge',
    question_text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct_answer: 1,
    created_by: undefined,
    created_at: new Date().toISOString()
  },
  {
    id: 'q3',
    class: 'Demo Class',
    subject: 'General Knowledge',
    question_text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct_answer: 1,
    created_by: undefined,
    created_at: new Date().toISOString()
  }
]

export default function ExamStartPage() {
  const router = useRouter()

  // Initialize Supabase client with env vars
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(0) // seconds

  // Calculate score based on correct answers
  function calculateScore(questions: Question[], answers: Record<string, number>) {
    let score = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) score++
    })
    return score
  }

  // Submit exam results
  const handleSubmit = useCallback(async () => {
    if (!student || !currentSession) return

    const score = calculateScore(questions, answers)

    const result: ExamResult = {
      id: generateId('result'),
      student_id: student.id,
      class: student.class,
      subject: currentSession.subject,
      answers,
      score,
      total_questions: questions.length,
      timestamp: new Date().toISOString(),
      cheating_flags: [], // add cheating flags detection later
      time_taken: currentSession.time_limit * 60 - timeRemaining
    }

    setIsLoading(true)

    try {
      // Save exam result to DB
      const { error: resultError } = await supabase
        .from('exam_results')
        .insert([result])

      if (resultError) {
        alert('Failed to save exam results. Please try again.')
        console.error(resultError)
        return
      }

      // Mark student as submitted
      await supabase
        .from('students')
        .update({ has_submitted: true })
        .eq('id', student.id)

      // Mark session as inactive
      await supabase
        .from('exam_sessions')
        .update({ is_active: false })
        .eq('id', currentSession.id)

      // Clear state/localstorage
      setStudent(null)
      setQuestions([])
      setCurrentSession(null)
      setCurrentQuestionIndex(0)
      setAnswers({})
      localStorage.removeItem('currentStudent')

      // Redirect to results page with query params
      router.push(
        `/exam/results?score=${score}&total=${questions.length}&subject=${encodeURIComponent(
          currentSession.subject
        )}`
      )
    } catch (error) {
      alert('Error submitting exam. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [student, currentSession, answers, questions, timeRemaining, supabase, router])

  // Timer countdown effect
  useEffect(() => {
    if (!currentSession) return

    setTimeRemaining(currentSession.time_limit * 60)

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmit() // auto-submit on timeout
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSession, handleSubmit])

  // Initialize Exam: fetch questions, create session, shuffle questions
  async function initializeExam(studentToStart: Student) {
    setIsLoading(true)

    try {
      // Prevent retake
      if (studentToStart.has_submitted) {
        alert('You have already submitted this exam and cannot retake it.')
        return
      }

      // Fetch questions from DB by class
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select('*')
        .eq('class', studentToStart.class)

      let fetchedQuestions: Question[]

      if (error || !questionsData?.length) {
        alert('No questions found for your class, loading demo questions.')
        fetchedQuestions = mockQuestions
      } else {
        // Parse options if stored as JSON string (Supabase might store strings)
        fetchedQuestions = questionsData.map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]')
        }))
      }

      // Shuffle questions uniquely for student
      const shuffledQuestions = shuffleArray(fetchedQuestions)

      // Create new exam session
      const session: ExamSession = {
        id: generateId('session'),
        student_id: studentToStart.id,
        class: studentToStart.class,
        subject: shuffledQuestions[0]?.subject || 'General',
        questions_order: shuffledQuestions.map(q => q.id),
        started_at: new Date().toISOString(),
        time_limit: 60, // 60 minutes
        current_question_index: 0,
        is_active: true
      }

      // Save session to DB
      const { error: sessionError } = await supabase
        .from('exam_sessions')
        .insert([session])

      if (sessionError) {
        alert('Failed to start exam session, please try again.')
        console.error(sessionError)
        return
      }

      // Update local state to start exam
      setStudent(studentToStart)
      setQuestions(shuffledQuestions)
      setCurrentSession(session)
      setCurrentQuestionIndex(0)
      setAnswers({})
    } catch (error) {
      alert('Error initializing exam. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle answer selection
  function handleAnswer(questionId: string, selectedOptionIndex: number) {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOptionIndex }))
  }

  // Navigate questions
  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Show loading screen
  if (isLoading) return <div>Loading...</div>

  // If no student, show start button (replace with real login)
  if (!student) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Exam</h1>
        <p className="mb-4">Click below to start the demo exam.</p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => initializeExam(mockStudent)}
        >
          Start Exam
        </button>
      </div>
    )
  }

  // Display current question
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">{currentSession?.subject} Exam</h1>
        <p>
          {student.full_name} • {student.class}
        </p>
        <p>Time Remaining: {formatTime(timeRemaining)}</p>
      </div>

      <div className="border p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <p className="mb-4">{currentQuestion.question_text}</p>

        <div>
          {currentQuestion.options.map((option, i) => (
            <label key={i} className="block mb-2 cursor-pointer">
              <input
                type="radio"
                name={`question_${currentQuestion.id}`}
                checked={answers[currentQuestion.id] === i}
                onChange={() => handleAnswer(currentQuestion.id, i)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  )
}
