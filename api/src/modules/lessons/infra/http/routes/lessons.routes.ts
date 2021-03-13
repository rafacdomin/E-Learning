import AdminAuth from '@modules/admins/infra/http/middlewares/AdminAuth';
import { Router } from 'express';
import LessonController from '../controllers/LessonController';

const lessonRouter = Router();
const lessonController = new LessonController();

lessonRouter.post('/', AdminAuth, lessonController.create);

lessonRouter.put('/:id', AdminAuth, lessonController.update);

export default lessonRouter;
