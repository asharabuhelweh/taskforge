# TaskForge Backend Migration

This document describes the real backend version of TaskForge without changing the frontend UI or removing the existing React stack.

## Goal

Current flow:

```txt
React -> Zustand -> localStorage
```

New flow:

```txt
React -> Zustand -> REST API -> SQLite
```

The important architectural decision is that Zustand stays in the frontend. Components still talk to Zustand; only the store implementation changes from local persistence to async API calls.

## Backend Structure

```txt
server/
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   └── env.ts
    ├── controllers/
    │   ├── auth.controller.ts
    │   ├── projects.controller.ts
    │   └── tasks.controller.ts
    ├── db/
    │   ├── database.ts
    │   ├── schema.sql
    │   └── schema.ts
    ├── middleware/
    │   ├── auth.middleware.ts
    │   └── error.middleware.ts
    ├── repositories/
    │   ├── project.repository.ts
    │   ├── task.repository.ts
    │   └── user.repository.ts
    ├── routes/
    │   ├── auth.routes.ts
    │   ├── index.ts
    │   ├── projects.routes.ts
    │   └── tasks.routes.ts
    ├── types/
    │   ├── domain.ts
    │   └── express.d.ts
    └── utils/
        ├── asyncHandler.ts
        └── httpError.ts
```

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'inProgress', 'done')),
  dueDate TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);
```

`ON DELETE CASCADE` means deleting a project automatically deletes its tasks at the database level.

## API Design

Auth:

```txt
POST /api/auth/login
```

Projects:

```txt
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Tasks:

```txt
GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

All project and task routes are protected by JWT middleware.

## Environment Variables

Frontend:

```bash
VITE_API_URL=http://localhost:4000/api
```

Backend:

```bash
PORT=4000
NODE_ENV=development
DATABASE_PATH=./data/taskforge.sqlite
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

Only `VITE_` variables are exposed to the browser. Keep `JWT_SECRET` and database paths on the backend only.

## Installation

Root frontend dependencies:

```bash
npm install
```

Backend dependencies:

```bash
cd server
npm install
```

## Startup Commands

Run the backend:

```bash
npm run dev:server
```

Run the frontend:

```bash
npm run dev
```

Login:

```txt
admin@test.com
123456
```

## Development Workflow

1. Start the backend on `http://localhost:4000`.
2. Start Vite on `http://localhost:5173`.
3. Login from the React app.
4. The auth store saves the JWT token in localStorage.
5. The project store calls the API with `Authorization: Bearer <token>`.
6. SQLite persists projects and tasks under `server/data/`.

## Store Migration

### addProject

Old:

```ts
addProject: (title, description) => {
  set((state) => {
    const newProject = {
      id: crypto.randomUUID(),
      title,
      description,
      tasks: [],
    };
    const updated = [...state.projects, newProject];
    saveToStorage(PROJECTS_KEY, updated);
    return { projects: updated };
  });
};
```

New:

```ts
addProject: async (title, description) => {
  const newProject = await createProjectRequest({ title, description });
  set((state) => ({ projects: [newProject, ...state.projects] }));
};
```

### updateProject

Old:

```ts
// Not previously exposed in the UI. A localStorage version would map and save.
updateProject: (projectId, title, description) => {
  set((state) => {
    const updated = state.projects.map((project) =>
      project.id === projectId ? { ...project, title, description } : project,
    );
    saveToStorage(PROJECTS_KEY, updated);
    return { projects: updated };
  });
};
```

New:

```ts
updateProject: async (projectId, title, description) => {
  const updatedProject = await updateProjectRequest(projectId, {
    title,
    description,
  });
  set((state) => ({
    projects: state.projects.map((project) =>
      project.id === projectId ? updatedProject : project,
    ),
  }));
};
```

### deleteProject

Old:

```ts
deleteProject: (projectId) => {
  set((state) => {
    const updated = state.projects.filter((project) => project.id !== projectId);
    saveToStorage(PROJECTS_KEY, updated);
    return { projects: updated };
  });
};
```

New:

```ts
deleteProject: async (projectId) => {
  await deleteProjectRequest(projectId);
  set((state) => ({
    projects: state.projects.filter((project) => project.id !== projectId),
  }));
};
```

### addTask

Old:

```ts
addTask: (projectId, title, status, dueDate) => {
  set((state) => {
    const updated = state.projects.map((project) => {
      if (project.id !== projectId) return project;
      const newTask = { id: crypto.randomUUID(), title, status, dueDate };
      return { ...project, tasks: [...project.tasks, newTask] };
    });
    saveToStorage(PROJECTS_KEY, updated);
    return { projects: updated };
  });
};
```

New:

```ts
addTask: async (projectId, title, status, dueDate) => {
  const newTask = await createTaskRequest(projectId, {
    title,
    status,
    dueDate,
  });
  set((state) => ({
    projects: state.projects.map((project) =>
      project.id === projectId
        ? { ...project, tasks: [...project.tasks, newTask] }
        : project,
    ),
  }));
};
```

### updateTask

Old:

```ts
updateTask: (projectId, taskId, title, status, dueDate) => {
  set((state) => {
    const updated = state.projects.map((project) => {
      if (project.id !== projectId) return project;
      const updatedTasks = project.tasks.map((task) =>
        task.id === taskId ? { ...task, title, status, dueDate } : task,
      );
      return { ...project, tasks: updatedTasks };
    });
    saveToStorage(PROJECTS_KEY, updated);
    return { projects: updated };
  });
};
```

New:

```ts
updateTask: async (projectId, taskId, title, status, dueDate) => {
  const updatedTask = await updateTaskRequest(taskId, {
    title,
    status,
    dueDate,
  });
  set((state) => ({
    projects: state.projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? updatedTask : task,
            ),
          }
        : project,
    ),
  }));
};
```

### deleteTask

Old:

```ts
deleteTask: (projectId, taskId) => {
  set((state) => {
    const updated = state.projects.map((project) => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        tasks: project.tasks.filter((task) => task.id !== taskId),
      };
    });
    saveToStorage(PROJECTS_KEY, updated);
    return { projects: updated };
  });
};
```

New:

```ts
deleteTask: async (projectId, taskId) => {
  await deleteTaskRequest(taskId);
  set((state) => ({
    projects: state.projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            tasks: project.tasks.filter((task) => task.id !== taskId),
          }
        : project,
    ),
  }));
};
```

### login

Old:

```ts
login: (email, password) => {
  if (email !== "admin@test.com" || password !== "22334455") {
    return false;
  }

  saveToStorage(SESSION_KEY, true);
  set({ isAuthenticated: true });
  return true;
};
```

New:

```ts
login: async (email, password) => {
  try {
    const { token } = await loginRequest(email, password);
    saveAuthToken(token);
    set({ isAuthenticated: true });
    return true;
  } catch {
    removeAuthToken();
    set({ isAuthenticated: false });
    return false;
  }
};
```

### logout

Old:

```ts
logout: () => {
  removeFromStorage(SESSION_KEY);
  set({ isAuthenticated: false });
};
```

New:

```ts
logout: () => {
  removeAuthToken();
  set({ isAuthenticated: false });
};
```

## Why This Architecture

Zustand remains the client state boundary, so components do not need to know whether data comes from localStorage or an API.

Repositories isolate database SQL from controllers. This makes controllers easier to read and makes a future SQLite-to-Postgres migration less invasive.

JWT auth is simple and stateless. The frontend stores a token; protected backend routes verify it before allowing project/task access.

SQLite is a good first real database because it requires no external service in development. For multi-user production scale, use Postgres with the same REST API shape.

## Production Architecture

Recommended production split:

```txt
Vercel or Netlify        React/Vite frontend
Render or Railway       Express API
Persistent disk/volume  SQLite database file
```

Production environment:

```bash
VITE_API_URL=https://api.taskforge.com/api

PORT=4000
NODE_ENV=production
DATABASE_PATH=/data/taskforge.sqlite
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://taskforge.com
```

SQLite production note: the deployment platform must provide persistent disk storage. If the platform filesystem is ephemeral, the SQLite database will be lost on redeploy. For horizontal scaling or team production usage, move the repository layer to Postgres.

## Interview Explanation

Describe the migration like this:

```txt
I preserved the frontend architecture and moved persistence behind the Zustand store. Components still dispatch store actions, but those actions now call a typed REST API. The backend uses Express controllers, JWT middleware, repository-based SQLite access, and centralized error handling.
```

Key talking points:

- I did not rewrite the UI because the UI was not the problem; persistence was.
- Zustand stayed as the state-management facade.
- The API owns persistence, ID generation, and authorization.
- SQLite was chosen for a low-friction backend version, but the repository layer makes a future Postgres migration straightforward.
- JWT protects project/task routes while keeping the initial login simple.
- CORS is restricted by `CORS_ORIGIN`.
- The frontend stores only the JWT, never database credentials or backend secrets.
- Deletes cascade from projects to tasks at the database level, preserving integrity even if a client fails midway.
- The architecture is deployable as separate frontend/backend services.
