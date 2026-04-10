# Mini Task Management System

## Project Overview

This project is a full-stack web application that allows users to manage tasks securely.
The system provides authentication using JWT and role-based access control with two roles: ADMIN and USER.

Users can create, update, delete, and manage tasks while ADMIN users can view all tasks in the system.

---

## Technologies Used

Frontend

- Next.js
- Axios

Backend

- Spring Boot
- Spring Security
- JWT Authentication

Database

- MySQL

Tools

- Postman
- GitHub

---

## Features

- User Registration
- User Login using JWT Authentication
- Role-Based Access Control (ADMIN / USER)
- Create Tasks
- Update Tasks
- Delete Tasks
- View Tasks
- Filter by Status
- Filter by Priority
- Pagination
- Sorting by Due Date and Priority

---

## Database Schema

Two main tables are used:

Users Table

- id
- username
- email
- password
- role

Tasks Table

- id
- title
- description
- status
- priority
- dueDate
- createdAt
- updatedAt
- userId

---

## API Endpoints

### Authentication

POST /api/auth/register
POST /api/auth/login

### Task Management

GET /api/tasks
GET /api/tasks/{id}
POST /api/tasks
PUT /api/tasks/{id}
DELETE /api/tasks/{id}

Filtering

GET /api/tasks?status=TODO
GET /api/tasks?priority=HIGH

Pagination

GET /api/tasks?page=0&size=10

---

## Environment Variables

Backend (.env)

DB_URL=jdbc:mysql://localhost:3306/taskdb
DB_USERNAME=root
DB_PASSWORD=password
JWT_SECRET=your_secret_key

Frontend (.env.local)

NEXT_PUBLIC_API_URL=http://localhost:8080/api

---

## Setup Instructions

### Backend

1. Navigate to backend folder
2. Run:

Windows:
```
.\mvnw clean install
.\mvnw spring-boot:run
```

Mac/Linux:
```
chmod +x mvnw
./mvnw clean install
./mvnw spring-boot:run
```

Server runs on
http://localhost:8080

---

### Frontend

1. Navigate to frontend folder
2. Run:

npm install
npm run dev

Application runs on
http://localhost:3000

---

## Folder Structure

frontend/
backend/
database/
README.md

---

## Author

Developed as part of Mini Task Management System assignment.
