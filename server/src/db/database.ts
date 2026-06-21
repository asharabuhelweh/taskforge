import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { env } from "../config/env";
import { databaseSchema } from "./schema";

const databaseDirectory = path.dirname(env.databasePath);
fs.mkdirSync(databaseDirectory, { recursive: true });

export const db = new Database(env.databasePath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.exec(databaseSchema);

const seedAdminUser = db.prepare(`
  INSERT INTO users (id, email, password)
  VALUES (@id, @email, @password)
  ON CONFLICT(email) DO NOTHING
`);

seedAdminUser.run({
  id: "admin-user",
  email: "admin@test.com",
  password: "123456",
});
