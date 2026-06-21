import { db } from "../db/database";
import { type User } from "../types/domain";

const findByEmailStatement = db.prepare(`
  SELECT id, email, password
  FROM users
  WHERE email = ?
`);

export const userRepository = {
  findByEmail(email: string): User | undefined {
    return findByEmailStatement.get(email) as User | undefined;
  },
};
