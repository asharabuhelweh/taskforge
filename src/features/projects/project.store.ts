import { create } from "zustand";
import { type Project, type Task } from "../../types/domain.ts";
import { loadFromStorage, saveToStorage } from "../../utils/persist.ts";
import { seedProjects } from "../../utils/seed.ts";

interface ProjectState {
  projects: Project[];
  addProject: (title: string, description: string) => void;
  deleteProject: (projectId: string) => void;
  addTask: (projectId: string, title: string, status: Task["status"], dueDate: string) => void;
  updateTask: (projectId: string, taskId: string, title: string, status: Task["status"], dueDate: string) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

const PROJECTS_KEY = "taskforge_projects";

export const useProjectStore = create<ProjectState>((set) => ({
  projects: loadFromStorage<Project[]>(PROJECTS_KEY, seedProjects),

  addProject: (title, description) => {
    set((state) => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        title,
        description,
        tasks: [],
      };
      const updated = [...state.projects, newProject];
      saveToStorage(PROJECTS_KEY, updated);
      return { projects: updated };
    });
  },

  deleteProject: (projectId) => {
    set((state) => {
      const updated = state.projects.filter((project) => project.id !== projectId);
      saveToStorage(PROJECTS_KEY, updated);
      return { projects: updated };
    });
  },

  addTask: (projectId, title, status, dueDate) => {
    set((state) => {
      const updated = state.projects.map((project) => {
        if (project.id !== projectId) return project;
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          status,
          dueDate,
        };
        return { ...project, tasks: [...project.tasks, newTask] };
      });
      saveToStorage(PROJECTS_KEY, updated);
      return { projects: updated };
    });
  },

  updateTask: (projectId, taskId, title, status, dueDate) => {
    set((state) => {
      const updated = state.projects.map((project) => {
        if (project.id !== projectId) return project;
        const updatedTasks = project.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return { ...task, title, status, dueDate };
        });
        return { ...project, tasks: updatedTasks };
      });
      saveToStorage(PROJECTS_KEY, updated);
      return { projects: updated };
    });
  },

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
  },
}));
