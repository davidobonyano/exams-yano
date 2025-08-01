import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question, Student, ExamSession } from '@/lib/types/database'

interface ExamState {
  // Current exam session
  currentSession: ExamSession | null
  student: Student | null
  questions: Question[]
  answers: Record<string, number>
  currentQuestionIndex: number
  timeRemaining: number
  isExamActive: boolean
  cheatingAttempts: string[]

  // Actions
  startExam: (session: ExamSession, student: Student, questions: Question[]) => void
  setAnswer: (questionId: string, answerIndex: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  addCheatingAttempt: (reason: string) => void
  updateTimeRemaining: (seconds: number) => void
  endExam: () => void
  resetExam: () => void
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      student: null,
      questions: [],
      answers: {},
      currentQuestionIndex: 0,
      timeRemaining: 0,
      isExamActive: false,
      cheatingAttempts: [],

      startExam: (session, student, questions) => {
        set({
          currentSession: session,
          student,
          questions,
          currentQuestionIndex: 0,
          timeRemaining: session.time_limit * 60, // Convert minutes to seconds
          isExamActive: true,
          answers: {},
          cheatingAttempts: []
        })
      },

      setAnswer: (questionId, answerIndex) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answerIndex
          }
        }))
      },

      nextQuestion: () => {
        set((state) => {
          const maxIndex = state.questions.length - 1
          return {
            currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, maxIndex)
          }
        })
      },

      previousQuestion: () => {
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
        }))
      },

      addCheatingAttempt: (reason) => {
        set((state) => ({
          cheatingAttempts: [...state.cheatingAttempts, reason]
        }))
      },

      updateTimeRemaining: (seconds) => {
        set({ timeRemaining: seconds })
      },

      endExam: () => {
        set({
          isExamActive: false
        })
      },

      resetExam: () => {
        set({
          currentSession: null,
          student: null,
          questions: [],
          answers: {},
          currentQuestionIndex: 0,
          timeRemaining: 0,
          isExamActive: false,
          cheatingAttempts: []
        })
      }
    }),
    {
      name: 'exam-storage',
      partialize: (state) => ({
        currentSession: state.currentSession,
        student: state.student,
        questions: state.questions,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        timeRemaining: state.timeRemaining,
        isExamActive: state.isExamActive,
        cheatingAttempts: state.cheatingAttempts
      })
    }
  )
)