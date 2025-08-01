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

fileRouter.delete('/:fileId', ensureAuthenticated, deleteFile);
fileRouter.put('/:fileId', ensureAuthenticated, updateFile);
fileRouter.get('/:fileId', ensureAuthenticated, getFileById);
fileRouter.get('/', ensureAuthenticated, getFiles);

const folderFilesRouter = Router();

folderFilesRouter.post(
  '/:folderId/files',
  ensureAuthenticated,
  upload.array('files'),
  createFiles
);

export { fileRouter, folderFilesRouter };
