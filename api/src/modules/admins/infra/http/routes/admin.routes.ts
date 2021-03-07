import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

// import ensureAuth from '../middlewares/ensureAuth';
import AdminsController from '../controllers/AdminsController';

const adminRoutes = Router();
const adminsController = new AdminsController();

adminRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  adminsController.create,
);

export default adminRoutes;
