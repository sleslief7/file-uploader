import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import { cloneFolders, moveFolders } from '../controllers/folderController';
import { cloneFiles, moveFiles } from '../controllers/fileController';

const itemRouter = Router();

itemRouter.post('/move', ensureAuthenticated, cloneFolders, cloneFiles);
itemRouter.post('/clone', ensureAuthenticated, moveFolders, moveFiles);

export default itemRouter;
