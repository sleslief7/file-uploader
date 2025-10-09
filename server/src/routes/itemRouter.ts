import { Router } from 'express';
import { ensureAuthenticated } from '../controllers/authController';
import { cloneItemsHandler } from '../controllers/itemController';
import {
  getItemsHandler,
  moveItemsHandler,
} from '../controllers/itemController';

const itemRouter = Router();

itemRouter.get('/', ensureAuthenticated, getItemsHandler);
itemRouter.post('/clone', ensureAuthenticated, cloneItemsHandler);
itemRouter.post('/move', ensureAuthenticated, moveItemsHandler);

export default itemRouter;
