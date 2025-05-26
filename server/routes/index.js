import { Router } from 'express';
import userRouter from './userRouter.js';
import fileRouter from './fileRouter.js';
import authRouter from '.authRouter.js';
import folderRouter from './folderRouter.js';

const apiRouter = Router();

apiRouter.use('/api/folders', folderRouter);
apiRouter.use('/api/users', userRouter);
apiRouter.use('/api/files', fileRouter);
apiRouter.use('/api', authRouter);

export default apiRouter;
