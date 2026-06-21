export interface Task {
  id: string;
  projectId?: string;
  title: string;
  status: "todo" | "inProgress" | "done";
  dueDate: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  tasks: Task[];
}
