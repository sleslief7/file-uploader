import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from './generated/prisma';

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.listen(PORT, () => {
  console.log(`Server is running
     on http://localhost:${PORT}`);
});
