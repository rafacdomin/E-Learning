import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

// import ensureAuth from '../middlewares/ensureAuth';
import AdminsController from '../controllers/AdminsController';
import SessionsController from '../controllers/SessionsController';

const adminRoutes = Router();
const adminsController = new AdminsController();
const sessionsController = new SessionsController();

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

adminRoutes.post(
  '/sessions',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default adminRoutes;
