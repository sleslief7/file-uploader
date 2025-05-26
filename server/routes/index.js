const { Router } = require('express');
const userRouter = require('./userRouter.js');
const fileRouter = require('./fileRouter.js');
const authRouter = require('./authRouter.js');
const folderRouter = require('./folderRouter.js');

const apiRouter = Router();

apiRouter.use('/api/folders', folderRouter);
apiRouter.use('/api/users', userRouter);
apiRouter.use('/api/files', fileRouter);
apiRouter.use('/api', authRouter);

module.exports = apiRouter;
