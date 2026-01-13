# evangadi-forum

# Evangadi Forum

A full-stack Q&A forum application with an integrated AI chatbot assistant. Users can ask questions, provide answers, edit their content, and interact with an AI-powered chatbot for instant help.

## 🚀 Features

- **User Authentication**: Registration, login, password reset via email
- **Question Management**: Ask, view, edit, and delete questions
- **Answer System**: Post answers to questions, edit and delete answers
- **User Profiles**: View and manage user profiles with profile picture uploads
- **AI Chatbot**: Integrated AI assistant powered by Groq (Llama 3.3) for instant help
- **Real-time Notifications**: Toast notifications for user actions
- **Protected Routes**: Authentication-based route protection
- **Responsive Design**: Modern UI built with React and Material-UI

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool
- **Material-UI (MUI)** - UI components
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service
- **OpenAI/Groq API** - AI chatbot integration
- **XSS** - Security (XSS protection)

## 📁 Project Structure

```
evangadi-forum/
│
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   ├── favicon.png
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── Api/
│   │   │   └── axiosConfig.js       # Axios configuration with base URL
│   │   │
│   │   ├── assets/                  # Images, sounds, and other assets
│   │   │   ├── sounds/              # Notification sounds
│   │   │   └── *.png, *.jpeg, *.svg
│   │   │
│   │   ├── components/              # Reusable React components
│   │   │   ├── ChatWidget/         # AI Chatbot widget
│   │   │   │   ├── ChatBot/        # Main chat component
│   │   │   │   ├── ChatHeader/     # Chat header
│   │   │   │   ├── ChatMessages/   # Message display
│   │   │   │   ├── ChatInput/      # Input field
│   │   │   │   ├── ChatError/      # Error handling
│   │   │   │   ├── TypingIndicator/# Loading indicator
│   │   │   │   └── ChatWidget.jsx
│   │   │   │
│   │   │   ├── Header/             # Navigation header
│   │   │   ├── Footer/             # Footer component
│   │   │   ├── Layout/             # Shared layout wrapper
│   │   │   ├── ProtectedRoute/    # Route protection component
│   │   │   └── ScrollToTop.jsx     # Scroll to top utility
│   │   │
│   │   ├── hooks/
│   │   │   └── useChatbot.js       # Custom hook for chatbot functionality
│   │   │
│   │   ├── Pages/                  # Page components
│   │   │   ├── Home/               # Questions feed
│   │   │   │   ├── Home.jsx
│   │   │   │   └── QuestionCard.jsx
│   │   │   │
│   │   │   ├── Landing/            # Landing/auth page
│   │   │   ├── Login/              # Login page
│   │   │   ├── Register/           # Registration page
│   │   │   ├── Askquestion/        # Ask a question page
│   │   │   ├── Answer/             # Answer page
│   │   │   │   ├── Answer.jsx
│   │   │   │   └── EditAnswer.jsx
│   │   │   │
│   │   │   ├── EditQuestion/       # Edit question page
│   │   │   ├── Profile/            # User profile page
│   │   │   ├── ForgotPassword/    # Password reset request
│   │   │   ├── ResetPassword/     # Password reset form
│   │   │   ├── HowItWorks/        # How it works page
│   │   │   ├── About/             # About page
│   │   │   └── NotFound/          # 404 page
│   │   │
│   │   ├── routes/
│   │   │   └── AppRouter.jsx       # Main routing configuration
│   │   │
│   │   ├── App.jsx                 # Main App component with context
│   │   ├── App.css                 # Global styles
│   │   ├── App.module.css          # Component styles
│   │   ├── index.css               # Base styles
│   │   └── main.jsx                # Entry point
│   │
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── eslint.config.js            # ESLint configuration
│
├── server/                          # Backend Node.js application
│   ├── controller/                  # Request handlers
│   │   ├── userController.js       # User operations (register, login, profile)
│   │   ├── questionController.js   # Question CRUD operations
│   │   ├── answerController.js     # Answer CRUD operations
│   │   └── chatController.js       # AI chatbot integration
│   │
│   ├── routes/                      # API route definitions
│   │   ├── userRoutes.js           # User endpoints
│   │   ├── questionRoute.js        # Question endpoints
│   │   ├── answerRoute.js          # Answer endpoints
│   │   └── chatRoutes.js           # Chat endpoints
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT authentication middleware
│   │
│   ├── DB/
│   │   ├── dbconfig.js             # MySQL database configuration
│   │   └── database_table.mb       # Database schema
│   │
│   ├── uploads/
│   │   └── profile-pictures/       # Uploaded profile images
│   │
│   ├── index.js                    # Server entry point
│   └── package.json                # Backend dependencies
│
└── README.md                        # This file
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- Groq API key (for AI chatbot)

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `server` directory with the following variables:

```env
HOST=localhost
USER=your_mysql_username
PASSWORD=your_mysql_password
DATABASE=your_database_name
PORT=5500
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_groq_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

4. Set up your MySQL database using the schema in `server/DB/database_table.mb`

5. Start the server:

```bash
npm start
```

The server will run on `http://localhost:5500`

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `client` directory (if needed):

```env
VITE_API_URL=http://localhost:5500
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port Vite assigns)

## 📡 API Endpoints

### Authentication Routes (`/api/user`)

- `POST /register` - Register a new user
- `POST /login` - User login
- `GET /check` - Verify JWT token
- `GET /profile-picture` - Get user profile picture
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password with token

### Question Routes (`/api/question`)

- `GET /` - Get all questions
- `GET /:questionid` - Get single question
- `POST /` - Create a new question
- `PUT /:questionid` - Update a question
- `DELETE /:questionid` - Delete a question

### Answer Routes (`/api/answer`)

- `GET /:questionid` - Get all answers for a question
- `POST /` - Post a new answer
- `PUT /:answerid` - Update an answer
- `DELETE /:answerid` - Delete an answer

### Chat Routes (`/api/chat`)

- `POST /` - Send message to AI chatbot
- `GET /history` - Get chat history
- `DELETE /history` - Clear chat history

**Note**: All routes except `/api/user/register`, `/api/user/login`, `/api/user/forgot-password`, and `/api/user/reset-password` require JWT authentication.

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After successful login, a token is stored in localStorage and sent with each authenticated request in the `Authorization` header:

```
Authorization: Bearer <token>
```

## 🤖 AI Chatbot

The chatbot is powered by Groq's Llama 3.3 70B model. It:

- Maintains conversation history (last 30 messages)
- Provides context-aware responses
- Stores chat history in the database
- Only accessible to authenticated users

## 🎨 Key Features Explained

### Protected Routes

Routes are protected using the `ProtectedRoute` component, which checks for authentication and redirects unauthenticated users to the login page.

### Question & Answer System

- Users can ask questions with titles, descriptions, and tags
- Other users can provide answers
- Question and answer authors can edit/delete their own content
- XSS protection is implemented on the backend

### Profile Management

- Users can upload profile pictures
- Profile pictures are stored in `server/uploads/profile-pictures/`
- Images are served statically via Express

### Email Service

Password reset functionality uses Nodemailer to send reset links via email.

## 🚦 Running the Application

1. Start the MySQL database
2. Start the backend server: `cd server && npm start`
3. Start the frontend dev server: `cd client && npm run dev`
4. Open `http://localhost:5173` in your browser

## 📝 Development Notes

- The frontend uses CSS Modules for component styling
- React Context API is used for global state management (user state)
- Axios interceptors handle authentication tokens automatically
- The chatbot widget is a floating button that appears for authenticated users
- All user inputs are sanitized using the XSS library on the backend

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- XSS protection on user inputs
- CORS configuration
- Protected API routes with middleware
- SQL injection prevention using parameterized queries

## 📄 License

ISC

## 👥 Contributing

This is a project for Evangadi Phase 4. For contributions, please follow standard Git workflow practices.

---

**Built with ❤️ for the Evangadi community**
