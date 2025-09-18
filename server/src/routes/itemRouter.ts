import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import { cloneFoldersHandler } from '../controllers/folderController';
import { cloneFilesHandler } from '../controllers/fileController';
import {
  getItemsHandler,
  moveItemsHandler,
} from '../controllers/itemController';

const itemRouter = Router();

itemRouter.get('/', ensureAuthenticated, getItemsHandler);
itemRouter.post(
  '/clone',
  ensureAuthenticated,
  cloneFoldersHandler,
  cloneFilesHandler
);
itemRouter.post('/move', ensureAuthenticated, moveItemsHandler);

export default itemRouter;
