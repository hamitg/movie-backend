import { Request } from 'express';

export interface UserPayload {
  userId: number;
  role: number;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
