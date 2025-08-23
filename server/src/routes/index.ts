import { Router } from 'express';
import userRouter from './userRouter';
import { fileRouter, folderFilesRouter } from './fileRouter';
import authRouter from './authRouter';
import folderRouter from './folderRouter';
import itemRouter from './itemRouter';

const apiRouter = Router();

apiRouter.use('/api/folders', folderRouter);
apiRouter.use('/api/users', userRouter);
apiRouter.use('/api/files', fileRouter);
apiRouter.use('/api/folders', folderFilesRouter);
apiRouter.use('/api/items', itemRouter);
apiRouter.use('/api', authRouter);

export default apiRouter;
