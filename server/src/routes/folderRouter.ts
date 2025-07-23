import { Router } from 'express';
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  getBreadCrumb,
  getFolderById,
  updateFolder,
  getFoldersAndFilesByParentFolderId,
} from '../controllers/folderController';
import { ensureAuthenticated } from '../controllers/authController';

const folderRouter = Router();

folderRouter.post('/', ensureAuthenticated, createFolder);
folderRouter.put('/:folderId', ensureAuthenticated, updateFolder);
folderRouter.delete('/:folderId', ensureAuthenticated, deleteFolder);
folderRouter.get('/:folderId', ensureAuthenticated, getFolderById);
folderRouter.get('/', ensureAuthenticated, getAllFolders);
folderRouter.get('/breadcrumb/:folderId', ensureAuthenticated, getBreadCrumb);
folderRouter.get(
  '/folderAndFiles/:folderId',
  ensureAuthenticated,
  getFoldersAndFilesByParentFolderId
);

export default folderRouter;
