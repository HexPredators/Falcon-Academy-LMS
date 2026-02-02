
# 🦅 Falcon Academy DLMS

**Advanced Digital Learning Management System & Digital Library with AI Integration**

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4-orange)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Ethiopian Education](https://img.shields.io/badge/Ethiopian%20Education%20System-Compatible-brightgreen)]()

## 🌟 Overview

Falcon Academy DLMS is a comprehensive, multilingual digital learning platform designed specifically for the Ethiopian education system. It features hierarchical administrative controls, Ethiopian curriculum support, and advanced AI integration to enhance teaching and learning experiences.

### 🎯 Key Features

- **🏫 Ethiopian Curriculum Integration** (Grades 9-12 with Natural/Social Science streams)
- **🤖 AI-Powered Assistant** with 4 intelligent modules
- **👥 Multi-Role System** (10 distinct user roles)
- **🌍 4-Language Support** (English, Amharic, Afaan Oromoo, Tigrigna)
- **📊 Real-time Analytics Dashboards**
- **📚 Digital Library Management**
- **👪 Parent-Child Progress Tracking**

## 🏗️ System Architecture

```
Falcon Academy DLMS
├── Frontend (React 18 + Vite)
│   ├── 70+ React Components
│   ├── 10+ Pages
│   ├── 4 Context Providers
│   └── 5 Custom Hooks
├── Backend (Node.js + Express)
│   ├── RESTful API
│   ├── JWT Authentication
│   ├── Role-Based Access Control
│   └── PostgreSQL Database
└── Features
    ├── AI Assistant
    ├── Assignment System
    ├── Quiz Engine
    ├── Digital Library
    ├── Messaging System
    └── Analytics Dashboard
```

## 👥 User Roles & Permissions

| Role | Access Level | Responsibilities |
|------|-------------|------------------|
| **Super Admin** | Full System | Platform owner, full control |
| **Mr. Kidane** | Grades 9-12 | Director overseeing all grades |
| **Mr. Aleme** | Grades 11-12 | Director for senior classes |
| **Mr. Zerihun** | Grades 9-10 | Director for junior classes |
| **School Administrator** | Administrative | User management, system configuration |
| **Teacher** | Subject-specific | Teaching, grading, communication |
| **Student** | Personal | Learning, assignments, quizzes |
| **Parent** | Child-linked | Progress monitoring, communication |
| **Librarian** | Library | Resource management |
| **Other** | Custom | Custom role configurations |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/falcon-academy-dlms.git
cd falcon-academy-dlms
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

### Backend Setup (if needed)

```bash
cd backend
npm install
# Configure database in .env
npm start
```

## 🎨 UI Components

### Core Components
- **Header**: Navigation with language/theme toggles
- **Sidebar**: Role-based navigation
- **Dashboard**: Role-specific analytics
- **Cards**: Interactive content displays
- **Tables**: Sortable, paginated data
- **Modals**: Reusable popup dialogs

### AI Assistant Components
- **HowWeWork**: Platform explanation module
- **LessonPlanner**: AI-generated lesson plans
- **StudyPlanner**: Personalized study schedules
- **LearningSupport**: Concept explanations & practice

## 📱 Features in Detail

### 1. 🏫 Ethiopian Education Structure
- **Grade Levels**: 9, 10, 11, 12
- **Streams**: Natural Science & Social Science (Grades 11-12)
- **Sections**: A, B, C, D, E, F, G
- **Academic Terms**: Semester-based system
- **Curriculum**: Ethiopian national standards

### 2. 🤖 Falcon AI Assistant
- **Circular Navigation**: TryHackMe-like interface
- **4 AI Modules**:
  - 📚 How We Work: Platform functionality guide
  - 📝 Lesson Planner: Curriculum-aligned plans
  - ⏰ Study Planner: Personalized schedules
  - 💡 Learning Support: Concept explanations

### 3. 📊 Academic Management
- **Assignment System**: Create, submit, grade assignments
- **Quiz Engine**: Multiple question types, auto-grading
- **Digital Library**: Categorized resources, reading progress
- **Grade Tracking**: Real-time performance monitoring

### 4. 👪 Parent System
- **Child Linking**: Request-based account connection
- **Progress Tracking**: Real-time academic monitoring
- **Communication**: Direct messaging with teachers
- **Notifications**: Automated alerts for grades/assignments

### 5. 🌍 Multilingual Support
- **English**: Default language
- **Amharic**: አማርኛ - Full interface translation
- **Afaan Oromoo**: Native Oromo language support
- **Tigrigna**: ትግርኛ - Complete interface translation

## 🗂️ Project Structure

```
falcon-academy-dlms/
├── frontend/
│   ├── src/
│   │   ├── components/          # 70+ React components
│   │   │   ├── Auth/           # Authentication components
│   │   │   ├── Dashboard/      # Role-specific dashboards
│   │   │   ├── AI/            # AI Assistant modules
│   │   │   ├── Assignments/   # Assignment management
│   │   │   ├── Quizzes/       # Quiz system
│   │   │   ├── Library/       # Digital library
│   │   │   ├── Messaging/     # Communication system
│   │   │   ├── News/          # Announcements
│   │   │   ├── Parents/       # Parent features
│   │   │   ├── Analytics/     # Charts and graphs
│   │   │   ├── Common/        # Shared components
│   │   │   └── Forms/         # Form components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS styles
│   │   ├── assets/            # Images, icons, translations
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── routes.jsx         # Routing configuration
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── index.html             # HTML template
├── backend/                   # Backend API server
├── database/                  # Database schemas
├── docs/                      # Documentation
└── README.md                  # This file
```

## 🔧 Technical Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **i18next** - Internationalization

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time features
- **Nodemailer** - Email service

## 🚀 Deployment

### Frontend Deployment (InfinityFree/Netlify)

```bash
npm run build
# Upload dist/ folder to hosting service
```

### Backend Deployment

```bash
# Set up environment variables
# Configure database
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Development Roadmap

### Phase 1: Core Infrastructure ✅
- ✅ User management with OTP verification
- ✅ Role-based access control
- ✅ Basic dashboards for each role

### Phase 2: Academic Features ✅
- ✅ Assignment and quiz systems
- ✅ Grade and section-specific filtering
- ✅ Parent-child linking workflow

### Phase 3: AI & Analytics ✅
- ✅ Falcon AI Assistant implementation
- ✅ Real-time analytics dashboards
- ✅ Advanced reporting

### Phase 4: Localization & Polish ✅
- ✅ Amharic, Afaan Oromoo, Tigrigna support
- ✅ Mobile optimization
- ✅ Performance enhancements

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new components
- Add tests for new features
- Update documentation accordingly
- Ensure multilingual support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethiopian Ministry of Education for curriculum guidelines
- All contributors and testers
- Open source libraries that made this possible
- The educational community for inspiration

## 📞 Support

For support, email: support.falconacademylms@gmail.com  
Or create an issue in the GitHub repository.

## 🌐 Live Demo

[Join Waitlist](https://falconacademy-Waitlist.wuaze.com)  
[Documentation](https://docs.falcon-academy-lms.wuaze.com)  
[API Reference](https://api.falcon-academy-lms.wuaze.com)

---

<p align="center">
  Powered by HexPredators
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Ethiopian%20Education%20-%20Digital%20Transformation-blue" alt="Ethiopian Education Digital Transformation">
</p>

## 🎯 Screenshots

### Dashboard Views
| Student Dashboard | Teacher Dashboard | Parent Dashboard |
|-------------------|-------------------|------------------|
| ![Student Dashboard](screenshots/student-dashboard.png) | ![Teacher Dashboard](screenshots/teacher-dashboard.png) | ![Parent Dashboard](screenshots/parent-dashboard.png) |

### AI Assistant
![AI Assistant](screenshots/ai-assistant.png)

### Mobile Views
| Mobile Login | Mobile Dashboard | Mobile Library |
|--------------|------------------|----------------|
| ![Mobile Login](screenshots/mobile-login.png) | ![Mobile Dashboard](screenshots/mobile-dashboard.png) | ![Mobile Library](screenshots/mobile-library.png) |

## 🔗 Useful Links

- [API Documentation](docs/api/)
- [User Guides](docs/user-guides/)
- [Deployment Guide](docs/deployment/)
- [Troubleshooting](docs/troubleshooting/)
- [Changelog](CHANGELOG.md)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/falcon-academy-dlms&type=Date)](https://star-history.com/#yourusername/falcon-academy-dlms&Date)

---

**Falcon Academy DLMS** - Revolutionizing Ethiopian Education through Digital Innovation 🚀
