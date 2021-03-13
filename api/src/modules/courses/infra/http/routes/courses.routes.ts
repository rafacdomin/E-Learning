import uploadConfig from '@config/upload';
import AdminAuth from '@modules/admins/infra/http/middlewares/AdminAuth';
import { Router } from 'express';
import multer from 'multer';
import LessonsController from '@modules/lessons/infra/http/controllers/LessonsController';
import CourseController from '../controllers/CourseController';

const upload = multer(uploadConfig);

const courseRouter = Router();
const courseController = new CourseController();
const lessonsController = new LessonsController();

courseRouter.post(
  '/',
  AdminAuth,
  upload.single('image'),
  courseController.create,
);

courseRouter.put(
  '/:id',
  AdminAuth,
  upload.single('image'),
  courseController.update,
);

courseRouter.delete('/:id', AdminAuth, courseController.delete);

courseRouter.get('/', courseController.list);

courseRouter.get('/:course_id/lessons', lessonsController.list);

export default courseRouter;
