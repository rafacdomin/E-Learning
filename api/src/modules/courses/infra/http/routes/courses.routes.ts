import uploadConfig from '@config/upload';
import AdminAuth from '@modules/admins/infra/http/middlewares/AdminAuth';
import { Router } from 'express';
import multer from 'multer';
import CourseController from '../controllers/CourseController';

const upload = multer(uploadConfig);

const courseRouter = Router();
const courseController = new CourseController();

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

courseRouter.get('/', courseController.list);

export default courseRouter;
