import { Router } from 'express';
import { upload } from '../middleware/upload';
import {
  createFilesHandler,
  deleteFilesHandler,
  getFilesHandler,
  getFileByIdHandler,
  updateFileHandler,
  renameFileHandler,
  getFileUrlHandler,
} from '../controllers/fileController';
import { ensureAuthenticated } from '../controllers/authController';

const fileRouter = Router();

fileRouter.delete('/', ensureAuthenticated, deleteFilesHandler);
fileRouter.put('/:fileId', ensureAuthenticated, updateFileHandler);
fileRouter.get('/:fileId', ensureAuthenticated, getFileByIdHandler);
fileRouter.get('/', ensureAuthenticated, getFilesHandler);
fileRouter.post('/:fileId/rename', ensureAuthenticated, renameFileHandler);
fileRouter.get('/:fileId/signed_url', ensureAuthenticated, getFileUrlHandler);

const folderFilesRouter = Router();

folderFilesRouter.post(
  '/:folderId/files',
  ensureAuthenticated,
  upload.array('files'),
  createFilesHandler
);

export { fileRouter, folderFilesRouter };
