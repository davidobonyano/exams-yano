// ===============================
// 👤 User Role Interfaces
// ===============================

export interface Student {
  id: string
  full_name: string
  class: string
  has_submitted: boolean
  created_at: string
}

export interface Teacher {
  id: string
  email: string
  full_name: string
  password_hash: string
  classes: string[]
  is_active: boolean
  created_at: string
}

export interface Admin {
  id: string
  email: string
  full_name: string
  password_hash: string
  role: string
  is_active: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  role: 'student' | 'teacher' | 'admin'
  full_name?: string
  email?: string
  class?: string
  classes?: string[]
}

// ===============================
// 📝 Exam & Question Interfaces
// ===============================

export interface Question {
  id: string
  class: string
  subject: string
  question_text: string
  options: string[]
  correct_answer: number
  created_by?: string | null
  created_at: string
}

export interface ExamSession {
  id: string
  student_id: string
  class: string
  subject: string
  questions_order: string[]
  started_at: string
  time_limit: number
  current_question_index: number
  is_active: boolean
}

export interface ExamResult {
  id: string
  student_id: string
  class: string
  subject: string
  answers: Record<string, number>
  score: number
  total_questions: number
  time_taken: number
  cheating_flags: string[]
  timestamp: string
}

// ===============================
// 🏫 Class & Subject Constants
// ===============================

export type NigerianClassLevel = 'JSS' | 'SS'

export interface NigerianClass {
  class_level: NigerianClassLevel
  class_name: string
  description: string
}

export const NIGERIAN_CLASSES: NigerianClass[] = [
  { class_level: 'JSS', class_name: 'JSS1A', description: 'Junior Secondary School 1A' },
  { class_level: 'JSS', class_name: 'JSS1B', description: 'Junior Secondary School 1B' },
  { class_level: 'JSS', class_name: 'JSS1C', description: 'Junior Secondary School 1C' },
  { class_level: 'JSS', class_name: 'JSS2A', description: 'Junior Secondary School 2A' },
  { class_level: 'JSS', class_name: 'JSS2B', description: 'Junior Secondary School 2B' },
  { class_level: 'JSS', class_name: 'JSS2C', description: 'Junior Secondary School 2C' },
  { class_level: 'JSS', class_name: 'JSS3A', description: 'Junior Secondary School 3A' },
  { class_level: 'JSS', class_name: 'JSS3B', description: 'Junior Secondary School 3B' },
  { class_level: 'JSS', class_name: 'JSS3C', description: 'Junior Secondary School 3C' },
  { class_level: 'SS', class_name: 'SS1A', description: 'Senior Secondary School 1A' },
  { class_level: 'SS', class_name: 'SS1B', description: 'Senior Secondary School 1B' },
  { class_level: 'SS', class_name: 'SS1C', description: 'Senior Secondary School 1C' },
  { class_level: 'SS', class_name: 'SS2A', description: 'Senior Secondary School 2A' },
  { class_level: 'SS', class_name: 'SS2B', description: 'Senior Secondary School 2B' },
  { class_level: 'SS', class_name: 'SS2C', description: 'Senior Secondary School 2C' },
  { class_level: 'SS', class_name: 'SS3A', description: 'Senior Secondary School 3A' },
  { class_level: 'SS', class_name: 'SS3B', description: 'Senior Secondary School 3B' },
  { class_level: 'SS', class_name: 'SS3C', description: 'Senior Secondary School 3C' }
]

export const NIGERIAN_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Biology',
  'Chemistry',
  'Physics',
  'Geography',
  'Economics',
  'Government',
  'Literature in English',
  'Agricultural Science',
  'Computer Studies',
  'Civic Education',
  'Basic Science',
  'Basic Technology',
  'Cultural and Creative Arts',
  'Business Studies',
  'French',
  'Hausa',
  'Igbo',
  'Yoruba'
]
