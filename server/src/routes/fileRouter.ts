import { Router } from 'express';
import { upload } from '../middleware/upload';
import {
  createFiles,
  deleteFile,
  getFiles,
  getFileById,
  updateFile,
} from '../controllers/fileController';
import { ensureAuthenticated } from '../controllers/authController';

const fileRouter = Router();

fileRouter.post(
  '/upload',
  ensureAuthenticated,
  upload.array('files'),
  createFiles
);
fileRouter.delete('/:fileId', ensureAuthenticated, deleteFile);
fileRouter.put('/:fileId', ensureAuthenticated, updateFile);
fileRouter.get('/:fileId', ensureAuthenticated, getFileById);
fileRouter.get('/', ensureAuthenticated, getFiles);

export default fileRouter;
