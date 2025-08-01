-- Create teachers table for teacher authentication
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    classes TEXT[] DEFAULT '{}', -- Array of classes they teach
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table for admin authentication
CREATE TABLE admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update students table with Nigerian classes
DROP TABLE IF EXISTS students CASCADE;
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    class TEXT NOT NULL,
    has_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update questions table for Nigerian classes
DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of option strings
    correct_answer INTEGER NOT NULL, -- Index of correct option (0-based)
    created_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update exam_results table
DROP TABLE IF EXISTS exam_results CASCADE;
CREATE TABLE exam_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    answers JSONB NOT NULL, -- Object mapping question_id to selected_option_index
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cheating_flags JSONB DEFAULT '[]'::jsonb, -- Array of cheating reasons
    time_taken INTEGER NOT NULL -- Time taken in seconds
);

-- Update exam_sessions table
DROP TABLE IF EXISTS exam_sessions CASCADE;
CREATE TABLE exam_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    questions_order JSONB NOT NULL, -- Array of question IDs in shuffled order
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_limit INTEGER NOT NULL, -- Time limit in minutes
    current_question_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Add indexes for better performance
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_name_class ON students(full_name, class);
CREATE INDEX idx_questions_class ON questions(class);
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX idx_exam_results_class ON exam_results(class);
CREATE INDEX idx_exam_sessions_student_id ON exam_sessions(student_id);

-- Insert sample teachers
INSERT INTO teachers (email, full_name, password_hash, classes) VALUES
('teacher1@school.edu.ng', 'Mrs. Adunni Afolabi', '$2a$10$example_hash_1', ARRAY['JSS1A', 'JSS1B', 'JSS2A']),
('teacher2@school.edu.ng', 'Mr. Chukwudi Okafor', '$2a$10$example_hash_2', ARRAY['JSS3A', 'JSS3B', 'SS1A']),
('teacher3@school.edu.ng', 'Miss Fatima Hassan', '$2a$10$example_hash_3', ARRAY['SS2A', 'SS2B', 'SS3A']),
('teacher4@school.edu.ng', 'Mr. Segun Adebayo', '$2a$10$example_hash_4', ARRAY['SS1B', 'SS2C', 'SS3B']);

-- Insert sample admins
INSERT INTO admins (email, full_name, password_hash) VALUES
('admin@school.edu.ng', 'Mr. Ibrahim Musa', '$2a$10$example_hash_admin'),
('principal@school.edu.ng', 'Dr. Grace Okwu', '$2a$10$example_hash_principal');

-- Insert sample students with Nigerian classes
INSERT INTO students (full_name, class, has_submitted) VALUES
-- Junior Secondary School 1 (JSS1)
('Adebayo Tunde', 'JSS1A', FALSE),
('Chioma Nwachukwu', 'JSS1A', FALSE),
('Fatima Abdullahi', 'JSS1A', FALSE),
('Kemi Adeoye', 'JSS1B', FALSE),
('Ibrahim Shehu', 'JSS1B', FALSE),

-- Junior Secondary School 2 (JSS2)
('Blessing Okoro', 'JSS2A', FALSE),
('Usman Garba', 'JSS2A', FALSE),
('Peace Ogbonna', 'JSS2A', FALSE),

-- Junior Secondary School 3 (JSS3)
('Daniel Eze', 'JSS3A', FALSE),
('Aminat Yusuf', 'JSS3A', FALSE),
('Samuel Olatunji', 'JSS3B', FALSE),

-- Senior Secondary School 1 (SS1)
('Jennifer Akpan', 'SS1A', FALSE),
('Mohammed Bello', 'SS1A', FALSE),
('Favour Nwosu', 'SS1B', FALSE),
('Yusuf Ahmed', 'SS1B', FALSE),

-- Senior Secondary School 2 (SS2)
('Precious Okon', 'SS2A', FALSE),
('Abdullahi Musa', 'SS2A', FALSE),
('Mercy Ajayi', 'SS2B', FALSE),
('Emeka Okafor', 'SS2C', FALSE),

-- Senior Secondary School 3 (SS3)
('Joy Ekpo', 'SS3A', FALSE),
('Suleiman Ibrahim', 'SS3A', FALSE),
('Chiamaka Nwoke', 'SS3B', FALSE);

-- Insert sample questions for JSS1A - Mathematics
INSERT INTO questions (class, subject, question_text, options, correct_answer) VALUES
('JSS1A', 'Mathematics', 'What is 15 + 25?', '["30", "35", "40", "45"]', 2),
('JSS1A', 'Mathematics', 'What is 8 × 7?', '["54", "56", "58", "60"]', 1),
('JSS1A', 'Mathematics', 'What is 100 ÷ 4?', '["20", "25", "30", "35"]', 1),
('JSS1A', 'Mathematics', 'What is the next number in the sequence: 2, 4, 6, 8, ?', '["9", "10", "11", "12"]', 1),
('JSS1A', 'Mathematics', 'How many sides does a triangle have?', '["2", "3", "4", "5"]', 1),

-- Insert sample questions for JSS2A - English Language
('JSS2A', 'English Language', 'What is the plural of "child"?', '["childs", "children", "childes", "child"]', 1),
('JSS2A', 'English Language', 'Which of these is a verb?', '["happy", "run", "red", "book"]', 1),
('JSS2A', 'English Language', 'What is the opposite of "big"?', '["large", "huge", "small", "tall"]', 2),
('JSS2A', 'English Language', 'Complete: I ___ to school every day.', '["go", "goes", "going", "gone"]', 0),
('JSS2A', 'English Language', 'Which sentence is correct?', '["He are coming", "He is coming", "He am coming", "He be coming"]', 1),

-- Insert sample questions for SS1A - Biology
('SS1A', 'Biology', 'What is the powerhouse of the cell?', '["Nucleus", "Ribosome", "Mitochondria", "Cytoplasm"]', 2),
('SS1A', 'Biology', 'Which blood type is known as the universal donor?', '["A", "B", "AB", "O"]', 3),
('SS1A', 'Biology', 'What is photosynthesis?', '["Breathing in plants", "Making food using sunlight", "Growing tall", "Producing flowers"]', 1),
('SS1A', 'Biology', 'How many chambers does a human heart have?', '["2", "3", "4", "5"]', 2),
('SS1A', 'Biology', 'What is the largest organ in the human body?', '["Heart", "Brain", "Liver", "Skin"]', 3),

-- Insert sample questions for SS2A - Chemistry
('SS2A', 'Chemistry', 'What is the chemical symbol for water?', '["H2O", "CO2", "NaCl", "O2"]', 0),
('SS2A', 'Chemistry', 'Which element has the symbol "Na"?', '["Nitrogen", "Sodium", "Neon", "Nickel"]', 1),
('SS2A', 'Chemistry', 'What is the pH of pure water?', '["6", "7", "8", "9"]', 1),
('SS2A', 'Chemistry', 'Which gas is most abundant in the atmosphere?', '["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"]', 2),
('SS2A', 'Chemistry', 'What is the atomic number of carbon?', '["4", "6", "8", "12"]', 1),

-- Insert sample questions for SS3A - Physics
('SS3A', 'Physics', 'What is the unit of force?', '["Joule", "Newton", "Watt", "Pascal"]', 1),
('SS3A', 'Physics', 'What is the speed of light in vacuum?', '["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁹ m/s", "3 × 10⁷ m/s"]', 0),
('SS3A', 'Physics', 'Which law states that energy cannot be created or destroyed?', '["Newton''s first law", "Law of conservation of energy", "Ohm''s law", "Archimedes principle"]', 1),
('SS3A', 'Physics', 'What is the SI unit of electric current?', '["Volt", "Ohm", "Ampere", "Coulomb"]', 2),
('SS3A', 'Physics', 'What type of lens is used to correct short-sightedness?', '["Convex", "Concave", "Bifocal", "Cylindrical"]', 1);

-- Enable Row Level Security (RLS)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for teachers table
CREATE POLICY "Teachers can view their own data" ON teachers
    FOR SELECT USING (true); -- For demo, allow all reads

CREATE POLICY "Teachers can update their own data" ON teachers
    FOR UPDATE USING (true); -- For demo, allow all updates

-- Create policies for admins table
CREATE POLICY "Admins can view all admin data" ON admins
    FOR SELECT USING (true);

CREATE POLICY "Admins can update their own data" ON admins
    FOR UPDATE USING (true);

-- Create policies for students table
CREATE POLICY "Students can view their own data" ON students
    FOR SELECT USING (true); -- For demo, allow all reads

CREATE POLICY "Students can update their submission status" ON students
    FOR UPDATE USING (true); -- For demo, allow all updates

-- Create policies for questions table
CREATE POLICY "Anyone can read questions" ON questions
    FOR SELECT USING (true);

CREATE POLICY "Teachers can manage questions for their classes" ON questions
    FOR ALL USING (true); -- For demo, allow all operations

-- Create policies for exam_results table
CREATE POLICY "Students can insert their own results" ON exam_results
    FOR INSERT WITH CHECK (true); -- For demo, allow all inserts

CREATE POLICY "Anyone can read exam results" ON exam_results
    FOR SELECT USING (true); -- For demo, allow all reads

-- Create policies for exam_sessions table
CREATE POLICY "Students can manage their own sessions" ON exam_sessions
    FOR ALL USING (true); -- For demo, allow all operations

-- Create a view for Nigerian education levels
CREATE OR REPLACE VIEW nigerian_classes AS
SELECT class_level, class_name, description FROM (
    VALUES 
    ('JSS', 'JSS1A', 'Junior Secondary School 1A'),
    ('JSS', 'JSS1B', 'Junior Secondary School 1B'),
    ('JSS', 'JSS1C', 'Junior Secondary School 1C'),
    ('JSS', 'JSS2A', 'Junior Secondary School 2A'),
    ('JSS', 'JSS2B', 'Junior Secondary School 2B'),
    ('JSS', 'JSS2C', 'Junior Secondary School 2C'),
    ('JSS', 'JSS3A', 'Junior Secondary School 3A'),
    ('JSS', 'JSS3B', 'Junior Secondary School 3B'),
    ('JSS', 'JSS3C', 'Junior Secondary School 3C'),
    ('SS', 'SS1A', 'Senior Secondary School 1A'),
    ('SS', 'SS1B', 'Senior Secondary School 1B'),
    ('SS', 'SS1C', 'Senior Secondary School 1C'),
    ('SS', 'SS2A', 'Senior Secondary School 2A'),
    ('SS', 'SS2B', 'Senior Secondary School 2B'),
    ('SS', 'SS2C', 'Senior Secondary School 2C'),
    ('SS', 'SS3A', 'Senior Secondary School 3A'),
    ('SS', 'SS3B', 'Senior Secondary School 3B'),
    ('SS', 'SS3C', 'Senior Secondary School 3C')
) AS t(class_level, class_name, description);