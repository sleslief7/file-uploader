import { Router } from 'express';
import { upload } from '../middleware/upload';
import {
  createFiles,
  deleteFiles,
  getFiles,
  getFileById,
  updateFile,
  renameFile,
  getFileUrl,
  cloneFiles,
  moveFiles,
} from '../controllers/fileController';
import { ensureAuthenticated } from '../controllers/authController';

const fileRouter = Router();

fileRouter.delete('/', ensureAuthenticated, deleteFiles);
fileRouter.put('/:fileId', ensureAuthenticated, updateFile);
fileRouter.get('/:fileId', ensureAuthenticated, getFileById);
fileRouter.get('/', ensureAuthenticated, getFiles);
fileRouter.post('/:fileId/rename', ensureAuthenticated, renameFile);
fileRouter.get('/:fileId/signed_url', ensureAuthenticated, getFileUrl);
fileRouter.post('/clone', ensureAuthenticated, cloneFiles);
fileRouter.post('/move', ensureAuthenticated, moveFiles);

const folderFilesRouter = Router();

folderFilesRouter.post(
  '/:folderId/files',
  ensureAuthenticated,
  upload.array('files'),
  createFiles
);

export { fileRouter, folderFilesRouter };
