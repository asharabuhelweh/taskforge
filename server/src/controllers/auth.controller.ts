import { type Request, type Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { type JwtPayload } from "../types/domain";
import { HttpError } from "../utils/httpError";

interface LoginBody {
  email?: string;
  password?: string;
}

export const authController = {
  login(req: Request<unknown, unknown, LoginBody>, res: Response): void {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }

    const user = userRepository.findByEmail(email);

    if (!user || user.password !== password) {
      throw new HttpError(401, "Invalid email or password");
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    const signOptions: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    };

    const token = jwt.sign(payload, env.jwtSecret, signOptions);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  },
};
