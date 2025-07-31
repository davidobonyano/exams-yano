# SecureExam - Online Examination Platform

A secure, anti-cheat online examination web application built with Next.js, Tailwind CSS, TypeScript, and Supabase. This platform supports role-based access for students, teachers, and admins with strict anti-cheating mechanisms.

## 🚀 Features

- **🔐 Authentication System**: Role-based access for students, teachers, and admins
- **🛡️ Anti-Cheat Protection**: Advanced monitoring for tab switching, copy-paste, dev tools, etc.
- **⏰ Timer Management**: Automatic submission when time expires
- **🔀 Question Randomization**: Shuffled questions for each student
- **📊 Real-time Results**: Instant scoring and grade calculation
- **📱 Responsive Design**: Works on all devices
- **🎯 One-time Exams**: Prevents multiple attempts

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Backend**: Supabase (Database, Authentication, Real-time)
- **State Management**: Zustand with persistence
- **Development**: ESLint, TypeScript strict mode

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier available)
- Basic knowledge of React/Next.js

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# The project is already created in ./online-exam-app
cd online-exam-app
npm install
```

### 2. Supabase Setup (MANUAL STEPS REQUIRED)

#### Step 2.1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `online-exam-platform`
   - Database Password: (choose a secure password)
   - Region: (choose closest to your location)
6. Click "Create new project"
7. Wait for the project to be ready (2-3 minutes)

#### Step 2.2: Get Your Supabase Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")
   - **service_role/secret key** (under "Project API keys")

#### Step 2.3: Set Up Environment Variables
1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and replace with your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Step 2.4: Create Database Tables
1. In your Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy the entire content from `supabase_schema.sql` file
4. Paste it in the SQL editor
5. Click "Run" to execute all commands
6. Verify tables are created by going to Table Editor

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing the Application

### Demo Credentials

The application comes with sample data. You can test with these credentials:

**Student Login:**
- Full Name: `John Doe`, Class: `Grade-10A`
- Full Name: `Jane Smith`, Class: `Grade-10A`
- Full Name: `Bob Johnson`, Class: `Grade-10B`
- Full Name: `Alice Brown`, Class: `Grade-10B`

### Testing Anti-Cheat Features

Try these to test anti-cheat detection:
1. Right-click anywhere during exam
2. Press F12 or Ctrl+Shift+I
3. Try Ctrl+C, Ctrl+V
4. Switch tabs (Alt+Tab or click another tab)
5. Try to refresh the page (F5 or Ctrl+R)

## 🏗️ Project Structure

```
online-exam-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── student-login/     # Student authentication
│   │   └── exam/              # Exam flow pages
│   │       ├── instructions/  # Pre-exam instructions
│   │       ├── start/         # Main exam interface
│   │       └── results/       # Post-exam results
│   ├── lib/
│   │   ├── supabase/          # Supabase client configuration
│   │   ├── store/             # Zustand state management
│   │   ├── hooks/             # Custom React hooks (anti-cheat)
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils.ts           # Utility functions
│   └── middleware.ts          # Route protection middleware
├── supabase_schema.sql        # Database schema and sample data
├── .env.local.example         # Environment variables template
└── README.md                  # This file
```

## 🔒 Security Features

### Anti-Cheat Mechanisms
- **Tab Switch Detection**: Monitors focus/blur events
- **Copy-Paste Prevention**: Disables clipboard operations
- **Right-Click Disabled**: Prevents context menu access
- **Developer Tools Blocking**: Detects F12, Ctrl+Shift+I, etc.
- **Page Navigation Prevention**: Blocks refresh and navigation
- **Text Selection Disabled**: Prevents text highlighting
- **Violation Tracking**: Logs all cheating attempts
- **Auto-Submission**: Submits exam after 2 violations

### Data Security
- Row Level Security (RLS) enabled on all tables
- Input sanitization and validation
- Secure session management
- Environment variable protection

## 📊 Database Schema

### Tables
1. **students**: Student credentials and submission status
2. **questions**: Exam questions with options and correct answers
3. **exam_results**: Student exam results and scores
4. **exam_sessions**: Active exam session tracking

### Key Features
- UUID primary keys for security
- JSONB for flexible data storage
- Optimized indexes for performance
- Foreign key constraints for data integrity

## 🎯 User Flows

### Student Flow
1. **Login**: Enter full name and class
2. **Instructions**: Read exam rules and guidelines
3. **Exam**: Answer questions with anti-cheat monitoring
4. **Results**: View score and performance

### Future: Teacher Flow (Not Implemented Yet)
- View class results
- Export student data
- Manage exam questions

### Future: Admin Flow (Not Implemented Yet)
- User management
- System analytics
- Global settings

## 🐛 Troubleshooting

### Common Issues

1. **"Incorrect credentials" error**
   - Verify student exists in database
   - Check exact spelling of name and class
   - Ensure case sensitivity

2. **Supabase connection errors**
   - Verify `.env.local` has correct URLs and keys
   - Check Supabase project is active
   - Ensure database tables are created

3. **Anti-cheat false positives**
   - Some browser extensions may trigger violations
   - Disable ad blockers during exam
   - Use incognito/private browsing mode

4. **Timer issues**
   - Ensure browser allows JavaScript
   - Check system time is correct
   - Avoid browser sleep/hibernation

### Development Issues

1. **Build errors**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Dependency conflicts**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
Make sure to add these in your deployment platform:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## 🔮 Future Enhancements

- [ ] Teacher dashboard implementation
- [ ] Admin panel for user management
- [ ] Question bank management interface
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] Proctoring features (camera monitoring)
- [ ] Multiple question types (essay, fill-in-blank)
- [ ] Exam scheduling system
- [ ] Mobile app version

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check this README first
2. Review the troubleshooting section
3. Check Supabase dashboard for errors
4. Create an issue in the repository

---

**Note**: This is a demo application. For production use, additional security measures, proper authentication, and comprehensive testing should be implemented.
