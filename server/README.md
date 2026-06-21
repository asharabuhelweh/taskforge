# TaskForge API

Node.js + Express + TypeScript + SQLite backend for TaskForge.

## Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Credentials

```txt
Email: admin@test.com
Password: 123456
```

## Scripts

```bash
npm run dev       # Start TypeScript dev server
npm run build     # Compile to dist/
npm run start     # Start compiled server
npm run typecheck # Type-check without emitting files
```

## API

```txt
POST   /api/auth/login

GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

All project and task routes require:

```txt
Authorization: Bearer <jwt>
```

## Runtime Files

SQLite data is written to `server/data/taskforge.sqlite` by default and is ignored by Git.
