import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sessionMiddleware from './auth/session';
import passport from './auth';
import apiRouter from './routes';

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : 0);
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
