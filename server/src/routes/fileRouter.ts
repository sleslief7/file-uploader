import { Router } from 'express';
import { upload } from '../middleware/upload';
import { createFile } from '../controllers/fileController';
import { ensureAuthenticated } from '../controllers/authController';

const fileRouter = Router();

fileRouter.post(
  '/upload',
  ensureAuthenticated,
  upload.single('file'),
  createFile
);

export default fileRouter;
