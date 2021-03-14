import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AdminAuth from '@modules/admins/infra/http/middlewares/AdminAuth';
import LessonsController from '../controllers/LessonsController';

const lessonRouter = Router();
const lessonsController = new LessonsController();

lessonRouter.post('/', AdminAuth, lessonsController.create);

lessonRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      description: Joi.string(),
      duration: Joi.number(),
      course_id: Joi.string().uuid(),
      video_id: Joi.string(),
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  AdminAuth,
  lessonsController.update,
);

export default lessonRouter;
