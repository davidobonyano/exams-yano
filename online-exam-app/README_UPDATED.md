# 🏫 SecureExam - Nigerian Online Examination Platform

A comprehensive, secure anti-cheat online examination web application built specifically for Nigerian educational institutions. Supports the complete Nigerian education system with JSS (Junior Secondary School) and SS (Senior Secondary School) classes.

## 🇳🇬 **Nigerian Education System Support**

- **JSS (Junior Secondary School)**: JSS1A, JSS1B, JSS1C, JSS2A, JSS2B, JSS2C, JSS3A, JSS3B, JSS3C
- **SS (Senior Secondary School)**: SS1A, SS1B, SS1C, SS2A, SS2B, SS2C, SS3A, SS3B, SS3C
- **Subjects**: Mathematics, English Language, Biology, Chemistry, Physics, Geography, Economics, Government, Literature, and more

## 🚀 **Complete Features**

### ✅ **Authentication System**
- **Students**: Login with Full Name + Class selection
- **Teachers**: Email/password authentication with class management
- **Admins**: Secure administrative access with system-wide controls

### ✅ **Student Experience**
- **🔐 Secure Login**: Nigerian class-based authentication
- **📋 Instructions Page**: Comprehensive exam rules and guidelines
- **📝 Exam Interface**: Real-time question navigation with subject-specific questions
- **⏱️ Smart Timer**: 60-minute countdown with auto-submission
- **📊 Results Display**: Instant scoring with grade calculation

### ✅ **Teacher Dashboard**
- **📚 Class Management**: View all assigned Nigerian classes
- **👥 Student Monitoring**: Track student progress and submissions
- **📈 Results Analytics**: Comprehensive performance reports
- **📤 Data Export**: CSV export for gradebooks
- **🚨 Cheating Reports**: Monitor anti-cheat violations
- **📊 Subject-wise Analysis**: Performance by subject and class

### ✅ **Admin Dashboard**
- **🏫 System Overview**: Complete school analytics
- **👨‍🏫 Teacher Management**: Add/edit/manage teacher accounts
- **👨‍🎓 Student Management**: Monitor all student accounts
- **📊 System Analytics**: School-wide performance metrics
- **🔍 Security Monitoring**: Track cheating incidents across the system
- **📈 Data Insights**: Performance trends and statistics

### ✅ **Advanced Anti-Cheat Protection**
- **🛡️ Tab Switch Detection**: Monitors focus/blur events
- **🚫 Copy/Paste Prevention**: Disabled clipboard operations
- **🖱️ Right-Click Disabled**: Prevents context menu access
- **🔧 Developer Tools Blocking**: Detects F12, Ctrl+Shift+I, etc.
- **🔄 Page Navigation Prevention**: Blocks refresh and navigation
- **📝 Text Selection Disabled**: Prevents highlighting text
- **📊 Violation Tracking**: Logs all cheating attempts with timestamps
- **⚡ Auto-Submission**: Submits exam after 2 violations

## 🛠️ **Technology Stack**

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with responsive design
- **Backend**: Supabase (PostgreSQL database with real-time capabilities)
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Authentication**: Supabase Auth with custom role management

## 📋 **Prerequisites**

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier available)
- Basic knowledge of React/Next.js

## 🔧 **Installation & Setup**

### 1. Project Setup
```bash
# Navigate to the project directory
cd online-exam-app
npm install
```

### 2. Supabase Setup (CRITICAL STEP)

#### Step 2.1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `nigerian-exam-platform`
   - **Database Password**: Choose a secure password
   - **Region**: Choose closest to Nigeria (EU-West or US-East)
6. Click "Create new project"
7. Wait for the project to be ready (2-3 minutes)

#### Step 2.2: Get Your Supabase Credentials
1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role/secret key** (starts with `eyJ...`)

#### Step 2.3: Configure Environment Variables
1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your actual Supabase values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Step 2.4: Create Database Tables
1. In Supabase dashboard → **SQL Editor**
2. Click "New Query"
3. Copy the ENTIRE content from `supabase_schema_updated.sql`
4. Paste and click "Run"
5. Verify tables are created in **Table Editor**

### 3. Run the Application
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🧪 **Testing with Nigerian Demo Data**

### 📚 **Student Login Credentials**
```
Name: Adebayo Tunde       | Class: JSS1A
Name: Chioma Nwachukwu    | Class: JSS1A  
Name: Jennifer Akpan      | Class: SS1A
Name: Mohammed Bello      | Class: SS1A
Name: Precious Okon       | Class: SS2A
Name: Joy Ekpo           | Class: SS3A
```

### 👨‍🏫 **Teacher Login Credentials**
```
Email: teacher1@school.edu.ng | Password: teacher123
Email: teacher2@school.edu.ng | Password: teacher123
Email: teacher3@school.edu.ng | Password: teacher123
Email: teacher4@school.edu.ng | Password: teacher123
```

### 🏛️ **Admin Login Credentials**
```
Email: admin@school.edu.ng      | Password: admin123
Email: principal@school.edu.ng  | Password: admin123
```

## 📊 **Database Schema**

### Core Tables
1. **students**: Nigerian student records with class assignments
2. **teachers**: Teacher accounts with class management
3. **admins**: Administrative user accounts
4. **questions**: Subject-specific questions by class
5. **exam_results**: Comprehensive exam results with analytics
6. **exam_sessions**: Active exam session tracking

### Nigerian Classes Supported
```
JSS (Junior Secondary):
- JSS1A, JSS1B, JSS1C (Age 10-12)
- JSS2A, JSS2B, JSS2C (Age 11-13)  
- JSS3A, JSS3B, JSS3C (Age 12-14)

SS (Senior Secondary):
- SS1A, SS1B, SS1C (Age 15-16)
- SS2A, SS2B, SS2C (Age 16-17)
- SS3A, SS3B, SS3C (Age 17-18)
```

## 🎯 **User Experience Flows**

### 👨‍🎓 **Student Journey**
1. **Landing Page** → Select "Student" role
2. **Student Login** → Enter name + select Nigerian class
3. **Instructions** → Read exam rules and agree to terms
4. **Exam Interface** → Answer subject-specific questions
5. **Results** → View performance and grade

### 👨‍🏫 **Teacher Journey**
1. **Landing Page** → Select "Teacher" role
2. **Teacher Login** → Email/password authentication
3. **Dashboard** → View assigned classes and student progress
4. **Analytics** → Monitor performance and export results
5. **Management** → Track cheating incidents and time usage

### 🏛️ **Admin Journey**
1. **Landing Page** → Select "Administrator" role
2. **Admin Login** → Secure administrative authentication
3. **System Overview** → School-wide statistics and analytics
4. **User Management** → Manage teachers and students
5. **Reports** → System-wide performance and security reports

## 🔒 **Security Features**

### Anti-Cheat Monitoring
- **Tab Switch Detection**: Maximum 2 violations before auto-submit
- **Copy/Paste Prevention**: All clipboard operations blocked
- **Developer Tools**: F12, Ctrl+Shift+I detection
- **Page Navigation**: Refresh and back button prevention
- **Focus Loss**: Window blur detection
- **Selection Disabled**: Text highlighting prevented

### Data Security
- **Row Level Security (RLS)** on all Supabase tables
- **Input sanitization** for all user inputs
- **UUID primary keys** for enhanced security
- **Environment variable protection**
- **Audit trail** for all exam activities

## 🏗️ **Project Structure**

```
online-exam-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page with role selection
│   │   ├── student-login/     # Nigerian student authentication
│   │   ├── teacher-login/     # Teacher email/password login
│   │   ├── admin-login/       # Admin authentication
│   │   ├── exam/              # Student exam flow
│   │   │   ├── instructions/  # Pre-exam rules and guidelines
│   │   │   ├── start/         # Main exam interface
│   │   │   └── results/       # Post-exam results display
│   │   ├── teacher/           # Teacher dashboard
│   │   │   └── dashboard/     # Class management and analytics
│   │   └── admin/             # Admin panel
│   │       └── dashboard/     # System administration
│   ├── lib/
│   │   ├── supabase/          # Database configuration
│   │   ├── store/             # Zustand state management
│   │   ├── hooks/             # Custom React hooks (anti-cheat)
│   │   ├── types/             # TypeScript definitions
│   │   └── utils.ts           # Utility functions
│   └── middleware.ts          # Route protection
├── supabase_schema_updated.sql # Complete database schema
├── .env.local.example         # Environment variables template
└── README.md                  # This documentation
```

## 📈 **Analytics & Reporting**

### Teacher Analytics
- **Class Performance**: Average scores by class
- **Subject Analysis**: Performance trends by subject
- **Time Management**: Student completion times
- **Cheating Incidents**: Security violation reports
- **Export Options**: CSV downloads for gradebooks

### Admin Analytics
- **System Overview**: School-wide performance metrics
- **User Management**: Teacher and student statistics
- **Security Monitoring**: Comprehensive cheating reports
- **Performance Trends**: Historical data analysis
- **Data Export**: JSON system reports

## 🚀 **Deployment**

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```
4. Deploy automatically

### Alternative Deployment Platforms
- **Netlify**: Zero-config deployment
- **Railway**: Full-stack deployment
- **Digital Ocean**: VPS hosting

## 🔮 **Future Enhancements**

- [ ] **Mobile App**: React Native version
- [ ] **Advanced Analytics**: ML-powered insights
- [ ] **Question Bank**: Collaborative question management
- [ ] **Email Notifications**: Result notifications to parents
- [ ] **Camera Proctoring**: Video monitoring during exams
- [ ] **Offline Support**: PWA capabilities
- [ ] **Multi-language**: Hausa, Igbo, Yoruba support
- [ ] **WAEC/JAMB Prep**: Standardized test preparation

## 📞 **Support & Documentation**

### Common Issues
1. **Supabase Connection**: Verify environment variables
2. **Login Problems**: Check exact name/class spelling  
3. **Anti-cheat Alerts**: Use incognito mode, disable extensions
4. **Performance**: Ensure stable internet connection

### Getting Help
1. Check this README for troubleshooting
2. Review Supabase dashboard for errors
3. Check browser console for error messages
4. Ensure all environment variables are correct

## 🎓 **Educational Impact**

This platform is designed specifically for Nigerian schools to:
- **Modernize Assessment**: Digital transformation of traditional exams
- **Ensure Integrity**: Combat examination malpractice
- **Improve Efficiency**: Instant results and automated grading
- **Enable Analytics**: Data-driven educational insights
- **Support Teachers**: Streamlined exam management
- **Prepare Students**: Digital literacy for modern education

## 🏆 **Key Benefits**

- **🔒 Security**: Industry-standard anti-cheat protection
- **🇳🇬 Localized**: Built for Nigerian education system
- **📊 Analytics**: Comprehensive performance insights
- **⚡ Performance**: Optimized for multiple concurrent users
- **💰 Cost-Effective**: Free tier available with Supabase
- **🔧 Scalable**: Grows with your institution
- **📱 Responsive**: Works on all devices

---

**Built with ❤️ for Nigerian Education**

This platform represents a significant step forward in modernizing Nigerian education through secure, technology-driven assessment tools that maintain the highest standards of academic integrity.