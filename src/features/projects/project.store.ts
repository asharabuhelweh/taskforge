import { create } from "zustand";
import { type Project, type Task } from "../../types/domain.ts";
import {
  createProject as createProjectRequest,
  createTask as createTaskRequest,
  deleteProject as deleteProjectRequest,
  deleteTask as deleteTaskRequest,
  fetchProjects,
  updateProject as updateProjectRequest,
  updateTask as updateTaskRequest,
} from "../../utils/api";

interface ProjectState {
  projects: Project[];
  loadProjects: () => Promise<void>;
  addProject: (title: string, description: string) => Promise<void>;
  updateProject: (
    projectId: string,
    title: string,
    description: string,
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addTask: (
    projectId: string,
    title: string,
    status: Task["status"],
    dueDate: string,
  ) => Promise<void>;
  updateTask: (
    projectId: string,
    taskId: string,
    title: string,
    status: Task["status"],
    dueDate: string,
  ) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],

  loadProjects: async () => {
    const projects = await fetchProjects();
    set({ projects });
  },

  addProject: async (title, description) => {
    const newProject = await createProjectRequest({ title, description });
    set((state) => {
      return { projects: [newProject, ...state.projects] };
    });
  },

  updateProject: async (projectId, title, description) => {
    const updatedProject = await updateProjectRequest(projectId, {
      title,
      description,
    });
    set((state) => {
      const projects = state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return updatedProject;
      });
      return { projects };
    });
  },

  deleteProject: async (projectId) => {
    await deleteProjectRequest(projectId);
    set((state) => {
      const projects = state.projects.filter(
        (project) => project.id !== projectId,
      );
      return { projects };
    });
  },

  addTask: async (projectId, title, status, dueDate) => {
    const newTask = await createTaskRequest(projectId, {
      title,
      status,
      dueDate,
    });
    set((state) => {
      const projects = state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return { ...project, tasks: [...project.tasks, newTask] };
      });
      return { projects };
    });
  },

  updateTask: async (projectId, taskId, title, status, dueDate) => {
    const updatedTask = await updateTaskRequest(taskId, {
      title,
      status,
      dueDate,
    });
    set((state) => {
      const projects = state.projects.map((project) => {
        if (project.id !== projectId) return project;
        const tasks = project.tasks.map((task) => {
          if (task.id !== taskId) return task;
          return updatedTask;
        });
        return { ...project, tasks };
      });
      return { projects };
    });
  },

  deleteTask: async (projectId, taskId) => {
    await deleteTaskRequest(taskId);
    set((state) => {
      const projects = state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: project.tasks.filter((task) => task.id !== taskId),
        };
      });
      return { projects };
    });
  },
}));
