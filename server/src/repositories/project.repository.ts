import { randomUUID } from "node:crypto";
import { db } from "../db/database";
import { type Project, type ProjectWithTasks } from "../types/domain";
import { taskRepository } from "./task.repository";

interface CreateProjectInput {
  title: string;
  description: string;
}

interface UpdateProjectInput {
  title: string;
  description: string;
}

const projectFields = "id, title, description, createdAt";

export const projectRepository = {
  findAll(): ProjectWithTasks[] {
    const projects = db
      .prepare(`
        SELECT ${projectFields}
        FROM projects
        ORDER BY datetime(createdAt) DESC
      `)
      .all() as Project[];

    return projects.map((project) => ({
      ...project,
      tasks: taskRepository.findByProjectId(project.id),
    }));
  },

  findById(id: string): Project | undefined {
    return db
      .prepare(`
        SELECT ${projectFields}
        FROM projects
        WHERE id = ?
      `)
      .get(id) as Project | undefined;
  },

  findByIdWithTasks(id: string): ProjectWithTasks | undefined {
    const project = this.findById(id);
    if (!project) return undefined;
    return {
      ...project,
      tasks: taskRepository.findByProjectId(project.id),
    };
  },

  create(input: CreateProjectInput): ProjectWithTasks {
    const id = randomUUID();

    db.prepare(`
      INSERT INTO projects (id, title, description)
      VALUES (@id, @title, @description)
    `).run({
      id,
      title: input.title,
      description: input.description,
    });

    const project = this.findByIdWithTasks(id);
    if (!project) {
      throw new Error("Failed to create project");
    }

    return project;
  },

  update(id: string, input: UpdateProjectInput): ProjectWithTasks | undefined {
    const result = db
      .prepare(`
        UPDATE projects
        SET title = @title,
            description = @description
        WHERE id = @id
      `)
      .run({
        id,
        title: input.title,
        description: input.description,
      });

    if (result.changes === 0) return undefined;
    return this.findByIdWithTasks(id);
  },

  delete(id: string): boolean {
    const result = db
      .prepare("DELETE FROM projects WHERE id = ?")
      .run(id);

    return result.changes > 0;
  },
};
