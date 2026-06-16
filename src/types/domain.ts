export interface Task {
  id: string;
  title: string;
  status: "todo" | "inProgress" | "done";
  dueDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}
