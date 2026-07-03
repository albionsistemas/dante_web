import { Router } from 'express';
import * as stylesController from '@/public/styles.controller';

export const stylesRouter = Router();

stylesRouter.get('/', stylesController.index);
