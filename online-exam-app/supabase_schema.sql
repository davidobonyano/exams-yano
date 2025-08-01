-- Create students table
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    class TEXT NOT NULL,
    has_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class TEXT NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of option strings
    correct_answer INTEGER NOT NULL, -- Index of correct option (0-based)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_results table
CREATE TABLE exam_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class TEXT NOT NULL,
    answers JSONB NOT NULL, -- Object mapping question_id to selected_option_index
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cheating_flags JSONB DEFAULT '[]'::jsonb, -- Array of cheating reasons
    time_taken INTEGER NOT NULL -- Time taken in seconds
);

-- Create exam_sessions table for tracking active sessions
CREATE TABLE exam_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class TEXT NOT NULL,
    questions_order JSONB NOT NULL, -- Array of question IDs in shuffled order
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_limit INTEGER NOT NULL, -- Time limit in minutes
    current_question_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Add indexes for better performance
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_name_class ON students(full_name, class);
CREATE INDEX idx_questions_class ON questions(class);
CREATE INDEX idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX idx_exam_results_class ON exam_results(class);
CREATE INDEX idx_exam_sessions_student_id ON exam_sessions(student_id);

-- Insert sample data for testing
INSERT INTO students (full_name, class, has_submitted) VALUES
('John Doe', 'Grade-10A', FALSE),
('Jane Smith', 'Grade-10A', FALSE),
('Bob Johnson', 'Grade-10B', FALSE),
('Alice Brown', 'Grade-10B', FALSE),
('Charlie Wilson', 'Grade-11A', FALSE);

-- Insert sample questions for Grade-10A
INSERT INTO questions (class, question_text, options, correct_answer) VALUES
('Grade-10A', 'What is the capital of France?', '["London", "Berlin", "Paris", "Madrid"]', 2),
('Grade-10A', 'Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 1),
('Grade-10A', 'What is 2 + 2?', '["3", "4", "5", "6"]', 1),
('Grade-10A', 'Who wrote Romeo and Juliet?', '["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]', 1),
('Grade-10A', 'What is the largest ocean on Earth?', '["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]', 3),
('Grade-10A', 'Which gas makes up most of Earth''s atmosphere?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 2),
('Grade-10A', 'What is the square root of 64?', '["6", "7", "8", "9"]', 2),
('Grade-10A', 'In which year did World War II end?', '["1944", "1945", "1946", "1947"]', 1),
('Grade-10A', 'What is the chemical symbol for gold?', '["Go", "Gd", "Au", "Ag"]', 2),
('Grade-10A', 'Which continent is the Sahara Desert located in?', '["Asia", "Australia", "Africa", "South America"]', 2);

-- Insert sample questions for Grade-10B
INSERT INTO questions (class, question_text, options, correct_answer) VALUES
('Grade-10B', 'What is the smallest prime number?', '["0", "1", "2", "3"]', 2),
('Grade-10B', 'Which element has the chemical symbol O?', '["Gold", "Silver", "Oxygen", "Iron"]', 2),
('Grade-10B', 'What is the capital of Japan?', '["Beijing", "Seoul", "Tokyo", "Bangkok"]', 2),
('Grade-10B', 'How many sides does a triangle have?', '["2", "3", "4", "5"]', 1),
('Grade-10B', 'What is the largest mammal?', '["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"]', 1),
('Grade-10B', 'Which planet is closest to the Sun?', '["Venus", "Earth", "Mercury", "Mars"]', 2),
('Grade-10B', 'What is 10 × 5?', '["40", "45", "50", "55"]', 2),
('Grade-10B', 'Who painted the Mona Lisa?', '["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Michelangelo"]', 2),
('Grade-10B', 'What is the boiling point of water?', '["90°C", "95°C", "100°C", "105°C"]', 2),
('Grade-10B', 'Which country is known as the Land of the Rising Sun?', '["China", "Japan", "South Korea", "Thailand"]', 1);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
CREATE POLICY "Students can view their own data" ON students
    FOR SELECT USING (true); -- For demo, allow all reads

CREATE POLICY "Students can update their submission status" ON students
    FOR UPDATE USING (true); -- For demo, allow all updates

-- Create policies for questions table
CREATE POLICY "Anyone can read questions" ON questions
    FOR SELECT USING (true);

-- Create policies for exam_results table
CREATE POLICY "Students can insert their own results" ON exam_results
    FOR INSERT WITH CHECK (true); -- For demo, allow all inserts

CREATE POLICY "Anyone can read exam results" ON exam_results
    FOR SELECT USING (true); -- For demo, allow all reads

-- Create policies for exam_sessions table
CREATE POLICY "Students can manage their own sessions" ON exam_sessions
    FOR ALL USING (true); -- For demo, allow all operations