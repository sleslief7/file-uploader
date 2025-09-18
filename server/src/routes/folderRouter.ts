import { Router } from 'express';
import {
  createFolderHandler,
  deleteFoldersHandler,
  getFoldersHandler,
  getBreadCrumbHandler,
  getFolderByIdHandler,
  updateFolderHandler,
  cloneFoldersHandler,
} from '../controllers/folderController';
import { ensureAuthenticated } from '../controllers/authController';

const folderRouter = Router();

folderRouter.post('/', ensureAuthenticated, createFolderHandler);
folderRouter.put('/:folderId', ensureAuthenticated, updateFolderHandler);
folderRouter.delete('/', ensureAuthenticated, deleteFoldersHandler);
folderRouter.get('/:folderId', ensureAuthenticated, getFolderByIdHandler);
folderRouter.get('/', ensureAuthenticated, getFoldersHandler);
folderRouter.get(
  '/:folderId/breadcrumb',
  ensureAuthenticated,
  getBreadCrumbHandler
);
folderRouter.post('/clone', ensureAuthenticated, cloneFoldersHandler);

export default folderRouter;
