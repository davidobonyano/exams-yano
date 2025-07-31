export interface Student {
  id: string
  full_name: string
  class: string
  has_submitted: boolean
  created_at: string
}

export interface Question {
  id: string
  class: string
  question_text: string
  options: string[] // JSON array of options
  correct_answer: number // Index of correct option
  created_at: string
}

export interface ExamResult {
  id: string
  student_id: string
  class: string
  answers: Record<string, number> // question_id -> selected_option_index
  score: number
  total_questions: number
  timestamp: string
  cheating_flags: string[] // Array of cheating reasons
  time_taken: number // in seconds
}

export interface UserProfile {
  id: string
  role: 'student' | 'teacher' | 'admin'
  full_name?: string
  class?: string
  email?: string
}

export interface ExamSession {
  id: string
  student_id: string
  class: string
  questions_order: string[] // Array of question IDs in shuffled order
  started_at: string
  time_limit: number // in minutes
  current_question_index: number
}