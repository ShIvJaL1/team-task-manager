# Team Task Manager - Full Stack Assessment

A deploy-ready full-stack Team Task Manager app built with React + Vite, Node.js + Express, PostgreSQL, JWT authentication, project CRUD, task assignment, role-based access, status tracking, and dashboard analytics.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js, PostgreSQL, JWT, bcrypt
- Database: PostgreSQL
- Deployment: Railway

## Features

- Signup and login with JWT
- User roles: `admin` and `member`
- Admin can create, update and delete projects
- Admin can add project members
- Admin can create, update and delete tasks
- Members can view projects/tasks related to them
- Members can update their assigned task status
- Task statuses: `todo`, `in_progress`, `done`
- Dashboard shows total, todo, in-progress, done and overdue task counts
- Overdue task list
- REST APIs with validations and PostgreSQL relationships

## Folder Structure

```txt
team-task-manager/
  backend/
    src/
      config/
        db.js
        initDb.js
      controllers/
        authController.js
        projectController.js
        taskController.js
        userController.js
      middleware/
        auth.js
        errorHandler.js
      routes/
        authRoutes.js
        projectRoutes.js
        taskRoutes.js
        userRoutes.js
      utils/
        token.js
      server.js
    .env.example
    package.json
    railway.json
  frontend/
    src/
      api/
        http.js
      components/
        Navbar.jsx
        ProtectedRoute.jsx
      context/
        AuthContext.jsx
      pages/
        Dashboard.jsx
        Login.jsx
        Projects.jsx
        Signup.jsx
        Tasks.jsx
      App.jsx
      main.jsx
      styles.css
    .env.example
    index.html
    package.json
    railway.json
  railway.json
  README.md
```

## Local Setup

### 1. Clone project

```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Setup PostgreSQL

Create a local PostgreSQL database:

```sql
CREATE DATABASE team_task_manager;
```

The backend automatically creates required tables on server startup.

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

### 4. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Environment Variables

### Backend `.env`

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/team_task_manager
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Auth

```txt
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Users

```txt
GET /api/users
```

Admin only.

### Projects

```txt
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:userId
```

Project create/update/delete/member management is admin only.

### Tasks

```txt
GET    /api/tasks/dashboard
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

Task create/update/delete is admin only. Members can update assigned task status.

## Railway Deployment

Railway can deploy Express and React apps from GitHub, and service variables are added from each service's Variables tab. Add PostgreSQL from Railway project canvas and use its generated `DATABASE_URL` in backend variables.

### Recommended Railway setup

Create 3 Railway services:

1. PostgreSQL database
2. Backend service from GitHub repo with root directory: `backend`
3. Frontend service from GitHub repo with root directory: `frontend`

### Backend Railway variables

```env
DATABASE_URL=<Railway PostgreSQL DATABASE_URL>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=1d
CLIENT_URL=<your-frontend-railway-url>
NODE_ENV=production
```

### Frontend Railway variables

```env
VITE_API_URL=<your-backend-railway-url>/api
```

### Railway notes

- Backend start command: `npm start`
- Frontend build command: `npm install && npm run build`
- Frontend start command: `npm start`
- Generate public domains for both frontend and backend services.

## Demo Flow

1. Signup as admin
2. Signup as member in another browser/incognito
3. Login as admin
4. Create a project and add member
5. Create a task assigned to member with due date
6. Login as member
7. View task and update status from `todo` to `in_progress` or `done`
8. Show dashboard counts and overdue items

## Demo Credentials Example

You can create these manually through signup:

```txt
Admin: admin@example.com / 123456
Member: member@example.com / 123456
```

## Submission Checklist

- Live frontend URL
- Live backend URL
- GitHub repository
- README file
- 2-5 minute demo video
