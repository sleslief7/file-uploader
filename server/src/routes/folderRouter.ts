import { Router } from 'express';
import {
  createFolder,
  deleteFolders,
  getFolders,
  getBreadCrumb,
  getFolderById,
  updateFolder,
  getItemsByParentFolderId,
  moveFolders,
  cloneFolders,
} from '../controllers/folderController';
import { ensureAuthenticated } from '../controllers/authController';

const folderRouter = Router();

folderRouter.post('/', ensureAuthenticated, createFolder);
folderRouter.put('/:folderId', ensureAuthenticated, updateFolder);
folderRouter.delete('/', ensureAuthenticated, deleteFolders);
folderRouter.get('/:folderId', ensureAuthenticated, getFolderById);
folderRouter.get('/', ensureAuthenticated, getFolders);
folderRouter.get('/:folderId/breadcrumb', ensureAuthenticated, getBreadCrumb);
folderRouter.get(
  '/:folderId/items',
  ensureAuthenticated,
  getItemsByParentFolderId
);
folderRouter.post('/move', ensureAuthenticated, moveFolders);
folderRouter.post('/clone', ensureAuthenticated, cloneFolders);

export default folderRouter;
