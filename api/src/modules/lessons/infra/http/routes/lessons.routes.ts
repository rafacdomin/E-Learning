import AdminAuth from '@modules/admins/infra/http/middlewares/AdminAuth';
import { Router } from 'express';
import LessonsController from '../controllers/LessonsController';

const lessonRouter = Router();
const lessonsController = new LessonsController();

lessonRouter.post('/', AdminAuth, lessonsController.create);

lessonRouter.put('/:id', AdminAuth, lessonsController.update);

export default lessonRouter;
