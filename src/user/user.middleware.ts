import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
 
const jwt = require('jsonwebtoken');

@Injectable()
export class TokenCheck implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['accessToken'];
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        return next();
      });
    }
    return res.sendStatus(403);
  }
}
