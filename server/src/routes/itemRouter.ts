import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import { cloneFolders, moveFolders } from '../controllers/folderController';
import { cloneFiles, moveFiles } from '../controllers/fileController';
import { moveItems } from '../controllers/userController';

const itemRouter = Router();

itemRouter.post('/clone', ensureAuthenticated, cloneFolders, cloneFiles);
itemRouter.post('/move', ensureAuthenticated, moveItems);

export default itemRouter;
