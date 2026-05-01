# Team Task Manager

Full-stack team task manager with React + Vite frontend, Node.js + Express backend, PostgreSQL database, JWT auth, and role-based access control.

## Live URLs
- **Frontend:** https://team-task-manager-three-chi.vercel.app
- **Backend:** https://team-task-manager-production-8432.up.railway.app

---

## Tech Stack
- **Frontend:** React 19, Vite, React Router v7, Axios
- **Backend:** Node.js, Express, PostgreSQL (Neon), JWT, bcrypt
- **Deployment:** Railway

---

## Features
- Signup / Login with JWT
- Roles: `admin` and `member`
- Admin: create/update/delete projects, tasks, manage members
- Member: view assigned projects/tasks, update task status
- Task statuses: `todo` → `in_progress` → `done`
- Dashboard: total, todo, in-progress, done, overdue counts
- Overdue task list
- Fully responsive UI

---

## Local Setup

### Backend
```bash
cd backend
npm install
# .env is already configured
npm start
# runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
# .env is already configured
npm run dev
# runs on http://localhost:5174
```

---

## Railway Deployment (Step by Step)

### 1. Push to GitHub
```bash
git add .
git commit -m "ready for deployment"
git push
```

### 2. Deploy Backend
1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repo
3. Click **Add variables** and add:
```
DATABASE_URL=postgresql://neondb_owner:npg_7MKwHLRkb0rZ@ep-frosty-dream-amys07ev.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=team_task_secret_123
JWT_EXPIRES_IN=1d
NODE_ENV=production
CLIENT_URL=https://YOUR_FRONTEND_URL (add after step 3)
```
4. Under **Settings → Root Directory** set: `backend`
5. Under **Settings → Start Command** set: `npm start`
6. Click **Deploy** → copy the generated domain (e.g. `https://xxx.up.railway.app`)

### 3. Deploy Frontend
1. In the same Railway project → **New Service** → **GitHub repo** (same repo)
2. Under **Settings → Root Directory** set: `frontend`
3. Add variable:
```
VITE_API_URL=https://YOUR_BACKEND_URL/api
```
4. Under **Settings → Build Command** set: `npm install && npm run build`
5. Under **Settings → Start Command** set: `npm run preview -- --host 0.0.0.0 --port 8080`
6. Click **Deploy** → copy the frontend domain

### 4. Update Backend CORS
Go back to the **backend service** → Variables → add/update:
```
CLIENT_URL=https://YOUR_FRONTEND_URL
```
Redeploy backend.

---

## API Endpoints

### Auth
```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Users
```
GET /api/users          (authenticated users)
```

### Projects
```
GET    /api/projects
POST   /api/projects                    (admin only)
PUT    /api/projects/:id                (admin only)
DELETE /api/projects/:id                (admin only)
POST   /api/projects/:id/members        (admin only)
DELETE /api/projects/:id/members/:uid   (admin only)
```

### Tasks
```
GET    /api/tasks/dashboard
GET    /api/tasks
POST   /api/tasks                       (admin only)
PUT    /api/tasks/:id                   (admin only)
PATCH  /api/tasks/:id/status            (assigned member or admin)
DELETE /api/tasks/:id                   (admin only)
```

---

## Demo Flow
1. Signup as **admin**
2. Open incognito → signup as **member**
3. As admin: create a project → create a task → assign to member
4. As member: login → view task → update status to `done`
5. As admin: check dashboard for updated counts

---

## Database Schema
```
users           (id, name, email, password_hash, role, created_at)
projects        (id, name, description, created_by, created_at)
project_members (project_id, user_id, role)
tasks           (id, project_id, title, description, assigned_to, due_date, status, created_by)
```
