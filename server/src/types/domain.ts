export type TaskStatus = "todo" | "inProgress" | "done";

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
