import * as jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: number;
}

export const expiresInValue: string = "2 h"; // format by ms, visit https://github.com/vercel/ms for more info

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }

  const secret = process.env.APP_SECRET!;
  return jwt.verify(token, secret) as AuthTokenPayload;
}
