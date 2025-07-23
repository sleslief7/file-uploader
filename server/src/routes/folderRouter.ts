import { Router } from 'express';
import {
  createFolder,
  deleteFolder,
  getFolders,
  getBreadCrumb,
  getFolderById,
  updateFolder,
  getItemsByParentFolderId,
} from '../controllers/folderController';
import { ensureAuthenticated } from '../controllers/authController';

const folderRouter = Router();

folderRouter.post('/', ensureAuthenticated, createFolder);
folderRouter.put('/:folderId', ensureAuthenticated, updateFolder);
folderRouter.delete('/:folderId', ensureAuthenticated, deleteFolder);
folderRouter.get('/:folderId', ensureAuthenticated, getFolderById);
folderRouter.get('/', ensureAuthenticated, getFolders);
folderRouter.get('/:folderId/breadcrumb', ensureAuthenticated, getBreadCrumb);
folderRouter.get(
  '/:folderId/items',
  ensureAuthenticated,
  getItemsByParentFolderId
);

export default folderRouter;
