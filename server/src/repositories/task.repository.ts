import { randomUUID } from "node:crypto";
import { db } from "../db/database";
import { type Task, type TaskStatus } from "../types/domain";

interface CreateTaskInput {
  projectId: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
}

interface UpdateTaskInput {
  title: string;
  status: TaskStatus;
  dueDate: string;
}

const taskFields = "id, projectId, title, status, dueDate, createdAt";

export const taskRepository = {
  findByProjectId(projectId: string): Task[] {
    return db
      .prepare(`
        SELECT ${taskFields}
        FROM tasks
        WHERE projectId = ?
        ORDER BY datetime(createdAt) DESC
      `)
      .all(projectId) as Task[];
  },

  findById(id: string): Task | undefined {
    return db
      .prepare(`
        SELECT ${taskFields}
        FROM tasks
        WHERE id = ?
      `)
      .get(id) as Task | undefined;
  },

  create(input: CreateTaskInput): Task {
    const id = randomUUID();

    db.prepare(`
      INSERT INTO tasks (id, projectId, title, status, dueDate)
      VALUES (@id, @projectId, @title, @status, @dueDate)
    `).run({
      id,
      projectId: input.projectId,
      title: input.title,
      status: input.status,
      dueDate: input.dueDate,
    });

    const task = this.findById(id);
    if (!task) {
      throw new Error("Failed to create task");
    }

    return task;
  },

  update(id: string, input: UpdateTaskInput): Task | undefined {
    const result = db
      .prepare(`
        UPDATE tasks
        SET title = @title,
            status = @status,
            dueDate = @dueDate
        WHERE id = @id
      `)
      .run({
        id,
        title: input.title,
        status: input.status,
        dueDate: input.dueDate,
      });

    if (result.changes === 0) return undefined;
    return this.findById(id);
  },

  delete(id: string): boolean {
    const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    return result.changes > 0;
  },
};
