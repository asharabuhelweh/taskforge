import { type Project, type Task } from "../types/domain";
import { getAuthToken } from "./authToken";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

type ProjectPayload = Pick<Project, "title" | "description">;
type TaskPayload = Pick<Task, "title" | "status" | "dueDate">;

const apiRequest = async <T>(
  path: string,
  { auth = true, headers, ...options }: ApiRequestOptions = {},
): Promise<T> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(error?.message ?? "API request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const loginRequest = (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>("/auth/login", {
    auth: false,
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const fetchProjects = (): Promise<Project[]> => {
  return apiRequest<Project[]>("/projects");
};

export const createProject = (payload: ProjectPayload): Promise<Project> => {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateProject = (
  projectId: string,
  payload: ProjectPayload,
): Promise<Project> => {
  return apiRequest<Project>(`/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteProject = (projectId: string): Promise<void> => {
  return apiRequest<void>(`/projects/${projectId}`, {
    method: "DELETE",
  });
};

export const fetchProjectTasks = (projectId: string): Promise<Task[]> => {
  return apiRequest<Task[]>(`/projects/${projectId}/tasks`);
};

export const createTask = (
  projectId: string,
  payload: TaskPayload,
): Promise<Task> => {
  return apiRequest<Task>(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateTask = (
  taskId: string,
  payload: TaskPayload,
): Promise<Task> => {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteTask = (taskId: string): Promise<void> => {
  return apiRequest<void>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
};
