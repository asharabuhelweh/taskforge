import { type Request, type Response } from "express";
import { projectRepository } from "../repositories/project.repository";
import { taskRepository } from "../repositories/task.repository";
import { type TaskStatus } from "../types/domain";
import { HttpError } from "../utils/httpError";

interface TaskBody {
  title?: string;
  status?: TaskStatus;
  dueDate?: string;
}

const taskStatuses: TaskStatus[] = ["todo", "inProgress", "done"];

const parseTaskBody = (body: TaskBody): Required<TaskBody> => {
  const title = body.title?.trim();
  const dueDate = body.dueDate?.trim();
  const status = body.status;

  if (!title || !dueDate || !status) {
    throw new HttpError(400, "Title, status, and due date are required");
  }

  if (!taskStatuses.includes(status)) {
    throw new HttpError(400, "Invalid task status");
  }

  return { title, status, dueDate };
};

export const tasksController = {
  listByProject(req: Request, res: Response): void {
    const project = projectRepository.findById(req.params.projectId);

    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    res.json(taskRepository.findByProjectId(project.id));
  },

  create(req: Request, res: Response): void {
    const project = projectRepository.findById(req.params.projectId);

    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const input = parseTaskBody(req.body as TaskBody);
    const task = taskRepository.create({
      ...input,
      projectId: project.id,
    });

    res.status(201).json(task);
  },

  update(req: Request, res: Response): void {
    const input = parseTaskBody(req.body as TaskBody);
    const task = taskRepository.update(req.params.id, input);

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    res.json(task);
  },

  delete(req: Request, res: Response): void {
    const deleted = taskRepository.delete(req.params.id);

    if (!deleted) {
      throw new HttpError(404, "Task not found");
    }

    res.status(204).send();
  },
};
