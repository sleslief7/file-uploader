import 'dotenv/config';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '../generated/prisma';

const isProduction = process.env.NODE_ENV === 'production';

const sessionMiddleware = expressSession({
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export default sessionMiddleware;
