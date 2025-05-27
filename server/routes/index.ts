import { Router } from 'express';
import userRouter from './userRouter';
import fileRouter from './fileRouter';
import authRouter from './authRouter';
import folderRouter from './folderRouter';

const apiRouter = Router();

apiRouter.use('/api/folders', folderRouter);
apiRouter.use('/api/users', userRouter);
apiRouter.use('/api/files', fileRouter);
apiRouter.use('/api', authRouter);

export default apiRouter;
