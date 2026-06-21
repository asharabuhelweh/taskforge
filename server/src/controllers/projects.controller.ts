import { type Request, type Response } from "express";
import { projectRepository } from "../repositories/project.repository";
import { HttpError } from "../utils/httpError";

interface ProjectBody {
  title?: string;
  description?: string;
}

const parseProjectBody = (body: ProjectBody): Required<ProjectBody> => {
  const title = body.title?.trim();
  const description = body.description?.trim();

  if (!title || !description) {
    throw new HttpError(400, "Title and description are required");
  }

  return { title, description };
};

export const projectsController = {
  list(_req: Request, res: Response): void {
    res.json(projectRepository.findAll());
  },

  create(req: Request, res: Response): void {
    const input = parseProjectBody(req.body as ProjectBody);
    const project = projectRepository.create(input);
    res.status(201).json(project);
  },

  update(req: Request, res: Response): void {
    const input = parseProjectBody(req.body as ProjectBody);
    const project = projectRepository.update(req.params.id, input);

    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    res.json(project);
  },

  delete(req: Request, res: Response): void {
    const deleted = projectRepository.delete(req.params.id);

    if (!deleted) {
      throw new HttpError(404, "Project not found");
    }

    res.status(204).send();
  },
};
