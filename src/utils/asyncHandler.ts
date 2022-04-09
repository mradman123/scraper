import { NextFunction } from 'connect';
import { Request, RequestHandler, Response } from 'express';

const asyncHandler =
  (handler: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch(next);

export default asyncHandler;
