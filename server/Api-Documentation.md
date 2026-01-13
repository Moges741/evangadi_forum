# Evangadi Forum - Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
   - [User Routes](#user-routes)
   - [Question Routes](#question-routes)
   - [Answer Routes](#answer-routes)
   - [Chat Routes](#chat-routes)
6. [Error Handling](#error-handling)
7. [Database Schema](#database-schema)
8. [Security Features](#security-features)
9. [File Upload](#file-upload)

---

## Overview

The Evangadi Forum backend is a RESTful API built with Node.js and Express.js. It provides endpoints for user authentication, question management, answer management, and AI-powered chatbot functionality.

**Tech Stack:**
- Node.js with Express.js
- MySQL database
- JWT for authentication
- Groq API (Llama 3.3) for AI chatbot
- Multer for file uploads
- Nodemailer for email services

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Token Expiration:** 1 day

### How to Get a Token

1. Register a new user: `POST /api/user/register`
2. Login: `POST /api/user/login`
3. Use the returned `token` in subsequent requests

---

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
HOST=localhost
USER=your_mysql_username
PASSWORD=your_mysql_password
DATABASE=your_database_name

# Server Configuration
PORT=5500

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Groq API (for AI chatbot)
OPENAI_API_KEY=your_groq_api_key

# Email Configuration (for password reset)
EMAIL_HOST=mail.birhann.com
EMAIL_PORT=465
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password
```

---

## API Endpoints

### User Routes

Base path: `/api/user`

#### 1. Register User

**Endpoint:** `POST /api/user/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "johndoe",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- All fields are required
- Password must be at least 8 characters
- Email must be unique

**Success Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400` - Missing fields or password too short
- `409` - Email already exists
- `500` - Internal server error

---

#### 2. Login

**Endpoint:** `POST /api/user/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "msg": "User login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "userid": 1,
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Internal server error

---

#### 3. Check User (Verify Token)

**Endpoint:** `GET /api/user/check`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "valid user",
  "username": "johndoe",
  "userid": 1
}
```

**Error Responses:**
- `401` - Invalid or missing token

---

#### 4. Upload Profile Picture

**Endpoint:** `POST /api/user/upload-profile-picture`

**Authentication:** Required

**Request:** Multipart form data
- Field name: `profilePicture`
- File types: JPEG, JPG, PNG, GIF
- Max file size: 5MB

**Success Response (200):**
```json
{
  "message": "Profile picture uploaded successfully",
  "profilePictureUrl": "/uploads/profile-pictures/profile-1-1234567890-987654321.jpg"
}
```

**Error Responses:**
- `400` - No file uploaded or invalid file type
- `401` - Authentication required
- `500` - Upload error

**Note:** Old profile picture is automatically deleted when uploading a new one.

---

#### 5. Get Profile Picture

**Endpoint:** `GET /api/user/profile-picture`

**Authentication:** Required

**Success Response (200):**
```json
{
  "profilePicture": "/uploads/profile-pictures/profile-1-1234567890.jpg"
}
```

**Note:** Returns `null` if user has no profile picture.

---

#### 6. Remove Profile Picture

**Endpoint:** `DELETE /api/user/remove-profile-picture`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Profile picture removed successfully"
}
```

---

#### 7. Forgot Password

**Endpoint:** `POST /api/user/forgot-password`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset link sent"
}
```

**Note:** Returns success even if email doesn't exist (security best practice).

**Email:** A password reset link is sent to the email address. The link expires in 15 minutes.

---

#### 8. Reset Password

**Endpoint:** `POST /api/user/reset-password/:token`

**Authentication:** Not required

**URL Parameters:**
- `token` - Password reset token from email

**Request Body:**
```json
{
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Error Responses:**
- `400` - Invalid or expired token

---

### Question Routes

Base path: `/api/question`

**Note:** All question routes require authentication except `GET /:questionid`.

---

#### 1. Get All Questions

**Endpoint:** `GET /api/question`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Questions retrieved successfully",
  "questions": [
    {
      "questionid": 1,
      "title": "How to use React hooks?",
      "description": "I'm new to React...",
      "tag": "react",
      "userid": 1,
      "username": "johndoe",
      "firstname": "John",
      "lastname": "Doe",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `404` - No questions found
- `401` - Authentication required
- `500` - Internal server error

**Note:** Questions are ordered by `questionid` DESC (newest first).

---

#### 2. Get Single Question

**Endpoint:** `GET /api/question/:questionid`

**Authentication:** Not required

**URL Parameters:**
- `questionid` - Question ID

**Success Response (200):**
```json
{
  "message": "Question retrieved successfully",
  "question": {
    "questionid": 1,
    "title": "How to use React hooks?",
    "description": "I'm new to React...",
    "tag": "react",
    "userid": 1,
    "username": "johndoe",
    "firstname": "John",
    "lastname": "Doe",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Question not found
- `500` - Internal server error

---

#### 3. Post Question

**Endpoint:** `POST /api/question`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "How to use React hooks?",
  "description": "I'm new to React and want to learn about hooks.",
  "tag": "react"
}
```

**Validation:**
- `title` - Required
- `description` - Required
- `tag` - Optional, max 20 characters
- All inputs are sanitized for XSS protection

**Success Response (201):**
```json
{
  "message": "Question Posted Successfully!",
  "questionId": 1
}
```

**Error Responses:**
- `400` - Missing required fields or tag too long
- `401` - Authentication required
- `500` - Internal server error

---

#### 4. Edit Question

**Endpoint:** `PUT /api/question/:questionid`

**Authentication:** Required

**URL Parameters:**
- `questionid` - Question ID

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "tag": "updated-tag"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Success Response (200):**
```json
{
  "message": "Question updated successfully."
}
```

**Error Responses:**
- `400` - Invalid question ID or tag too long
- `401` - Authentication required
- `403` - You can only edit your own questions
- `404` - Question not found
- `500` - Internal server error

**Authorization:** Users can only edit their own questions.

---

#### 5. Delete Question

**Endpoint:** `DELETE /api/question/:questionid`

**Authentication:** Required

**URL Parameters:**
- `questionid` - Question ID

**Success Response (200):**
```json
{
  "message": "Question deleted successfully."
}
```

**Error Responses:**
- `400` - Invalid question ID
- `401` - Authentication required
- `403` - You can only delete your own questions
- `404` - Question not found
- `500` - Internal server error

**Authorization:** Users can only delete their own questions.

---

### Answer Routes

Base path: `/api/answer`

**Note:** All answer routes require authentication except `GET /:question_id` and `GET /:question_id/summary`.

---

#### 1. Get Answers for a Question

**Endpoint:** `GET /api/answer/:question_id`

**Authentication:** Not required

**URL Parameters:**
- `question_id` - Question ID

**Success Response (200):**
```json
{
  "answers": [
    {
      "answer_id": 1,
      "content": "React hooks are functions that let you use state...",
      "user_name": "johndoe",
      "created_at": "2024-01-15T11:00:00.000Z",
      "userid": 2
    }
  ]
}
```

**Error Responses:**
- `400` - Invalid question_id
- `404` - Question not found
- `500` - Internal server error

---

#### 2. Get Single Answer

**Endpoint:** `GET /api/answer/single/:answer_id`

**Authentication:** Not required

**URL Parameters:**
- `answer_id` - Answer ID

**Success Response (200):**
```json
{
  "answer": {
    "answerid": 1,
    "answer": "React hooks are functions...",
    "questionid": 1,
    "userid": 2,
    "created_at": "2024-01-15T11:00:00.000Z",
    "username": "johndoe"
  }
}
```

**Error Responses:**
- `400` - Invalid answer_id
- `404` - Answer not found
- `500` - Internal server error

---

#### 3. Get Answer Summary (AI-Powered)

**Endpoint:** `GET /api/answer/:question_id/summary`

**Authentication:** Not required

**URL Parameters:**
- `question_id` - Question ID

**Success Response (200):**
```json
{
  "summary": "React hooks are functions that allow functional components to use state and lifecycle features. They were introduced in React 16.8 and provide a way to reuse stateful logic between components.",
  "answerCount": 3
}
```

**Error Responses:**
- `404` - Question not found
- `500` - Failed to summarize answers

**Note:** Uses Groq API (Llama 3.3 70B) to generate a concise summary of all answers for a question. Returns "No answers yet to summarize" if there are no answers.

---

#### 4. Post Answer

**Endpoint:** `POST /api/answer`

**Authentication:** Required

**Request Body:**
```json
{
  "question_id": 1,
  "answer": "React hooks are functions that let you use state and other React features in functional components."
}
```

**Validation:**
- `question_id` - Required, must be a valid integer
- `answer` - Required

**Success Response (201):**
```json
{
  "message": "Answer posted successfully"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid question_id
- `401` - Authentication required
- `404` - Question not found
- `500` - Internal server error

---

#### 5. Edit Answer

**Endpoint:** `PUT /api/answer/:answer_id`

**Authentication:** Required

**URL Parameters:**
- `answer_id` - Answer ID

**Request Body:**
```json
{
  "answer": "Updated answer content"
}
```

**Success Response (200):**
```json
{
  "message": "Answer updated successfully"
}
```

**Error Responses:**
- `400` - Invalid answer_id or missing answer content
- `401` - Authentication required
- `403` - You can only edit your own answers
- `404` - Answer not found
- `500` - Internal server error

**Authorization:** Users can only edit their own answers.

**Security:** Answer content is sanitized for XSS protection.

---

#### 6. Delete Answer

**Endpoint:** `DELETE /api/answer/:answer_id`

**Authentication:** Required

**URL Parameters:**
- `answer_id` - Answer ID

**Success Response (200):**
```json
{
  "message": "Answer deleted successfully"
}
```

**Error Responses:**
- `400` - Invalid answer_id
- `401` - Authentication required
- `403` - You can only delete your own answers
- `404` - Answer not found
- `500` - Internal server error

**Authorization:** Users can only delete their own answers.

---

### Chat Routes

Base path: `/api/chat`

**Note:** All chat routes require authentication.

---

#### 1. Send Chat Message

**Endpoint:** `POST /api/chat`

**Authentication:** Required

**Request Body:**
```json
{
  "prompt": "What is React?"
}
```

**Success Response (200):**
```json
{
  "answer": "React is a JavaScript library for building user interfaces..."
}
```

**Error Responses:**
- `400` - Prompt is required
- `401` - Authentication required
- `500` - Internal server error

**Features:**
- Maintains conversation history (last 30 messages)
- Uses Groq API with Llama 3.3 70B model
- Stores chat history in database
- Temperature: 0.2 (for consistent responses)
- Max tokens: 1024

**System Prompt:** "You are a direct, high-efficiency AI assistant. No fluff."

---

#### 2. Get Chat History

**Endpoint:** `GET /api/chat/history`

**Authentication:** Required

**Success Response (200):**
```json
{
  "history": [
    {
      "id": 1234567890,
      "human": "What is React?",
      "model": "React is a JavaScript library..."
    },
    {
      "id": 1234567891,
      "human": "How do I use hooks?",
      "model": "React hooks are functions..."
    }
  ]
}
```

**Note:** Returns last 20 messages, formatted as conversation pairs.

**Error Responses:**
- `401` - Authentication required
- `500` - Failed to fetch history

---

#### 3. Delete Chat History

**Endpoint:** `DELETE /api/chat/history`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Chat history cleared successfully"
}
```

**Error Responses:**
- `401` - Authentication required
- `500` - Failed to delete chat history

---

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required/invalid)
- `403` - Forbidden (authorization failed)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  userid INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Questions Table
```sql
CREATE TABLE questions (
  questionid INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tag VARCHAR(20),
  userid INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);
```

### Answers Table
```sql
CREATE TABLE answers (
  answerid INT PRIMARY KEY AUTO_INCREMENT,
  questionid INT NOT NULL,
  userid INT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (questionid) REFERENCES questions(questionid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);
```

### Chat History Table
```sql
CREATE TABLE chat_history (
  chatid INT PRIMARY KEY AUTO_INCREMENT,
  userid INT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);
```

---

## Security Features

1. **Password Hashing:** Uses bcrypt with salt rounds of 10
2. **JWT Authentication:** Token-based authentication with 1-day expiration
3. **XSS Protection:** All user inputs are sanitized using the `xss` library
4. **SQL Injection Prevention:** Uses parameterized queries
5. **File Upload Validation:** 
   - File type validation (images only)
   - File size limit (5MB)
   - Secure filename generation
6. **CORS:** Configured for cross-origin requests
7. **Password Reset Security:**
   - Tokens expire in 15 minutes
   - Tokens are hashed before storage
   - Tokens are cleared after use

---

## File Upload

### Profile Picture Upload

**Configuration:**
- Storage: Local disk (`uploads/profile-pictures/`)
- Allowed types: JPEG, JPG, PNG, GIF
- Max size: 5MB
- Filename format: `profile-{userid}-{timestamp}-{random}.{ext}`

**File Management:**
- Old profile pictures are automatically deleted when uploading a new one
- Files can be manually removed via DELETE endpoint
- Files are served statically via Express: `/uploads/profile-pictures/{filename}`

---

## Testing Endpoints

### Health Check

**Endpoint:** `GET /test`

**Response:**
```
API is running
```

Use this endpoint to verify the server is running.

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

---

## Notes

1. **Database Connection:** Uses connection pooling (limit: 11 connections)
2. **Error Logging:** Errors are logged to console
3. **Static Files:** Profile pictures are served from `/uploads` directory
4. **AI Integration:** Uses Groq API (not OpenAI) with base URL override
5. **Email Service:** Configured for cPanel email hosting

---

## Support

For issues or questions, please refer to the main project README or contact the development team.

---

**Last Updated:** January 2024
