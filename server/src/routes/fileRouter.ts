import { Router } from 'express';
import { upload } from '../middleware/upload';
import {
  createFile,
  deleteFile,
  getAllFiles,
  getFileById,
  updateFile,
} from '../controllers/fileController';
import { ensureAuthenticated } from '../controllers/authController';

const fileRouter = Router();

fileRouter.post(
  '/upload',
  ensureAuthenticated,
  upload.single('file'),
  createFile
);
fileRouter.delete('/:fileId', ensureAuthenticated, deleteFile);
fileRouter.put('/:fileId', ensureAuthenticated, updateFile);
fileRouter.get('/:fileId', ensureAuthenticated, getFileById);
fileRouter.get('/', ensureAuthenticated, getAllFiles);

export default fileRouter;
