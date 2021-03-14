import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';
import AdminAuth from '@modules/admins/infra/http/middlewares/AdminAuth';
import LessonsController from '@modules/lessons/infra/http/controllers/LessonsController';
import CourseController from '../controllers/CourseController';

const upload = multer(uploadConfig);

const courseRouter = Router();
const courseController = new CourseController();
const lessonsController = new LessonsController();

courseRouter.post(
  '/',
  upload.single('image'),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  AdminAuth,
  courseController.create,
);

courseRouter.put(
  '/:id',
  upload.single('image'),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  AdminAuth,
  courseController.update,
);

courseRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  AdminAuth,
  courseController.delete,
);

courseRouter.get('/', courseController.list);

courseRouter.get(
  '/:course_id/lessons',
  celebrate({
    [Segments.PARAMS]: {
      course_id: Joi.string().uuid().required(),
    },
  }),
  lessonsController.list,
);

courseRouter.delete(
  '/:course_id/lessons/:id',
  celebrate({
    [Segments.PARAMS]: {
      course_id: Joi.string().uuid().required(),
      id: Joi.string().uuid().required(),
    },
  }),
  AdminAuth,
  lessonsController.delete,
);

export default courseRouter;
