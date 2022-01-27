import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";
import { Request } from "express";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: number;
  secret: string;
}

export const context = ({ req }: { req: Request }): Context => {
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;

  const secret = process.env.APP_SECRET!;

  return {
    prisma,
    userId: token?.userId,
    secret,
  };
};
