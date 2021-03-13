import { Router } from 'express';

import adminRoutes from '@modules/admins/infra/http/routes/admin.routes';
import courseRoutes from '@modules/courses/infra/http/routes/courses.routes';
import lessonsRoutes from '@modules/lessons/infra/http/routes/lessons.routes';
import userRoutes from '@modules/users/infra/http/routes/user.routes';

const routes = Router();
routes.use('/admins', adminRoutes);
routes.use('/courses', courseRoutes);
routes.use('/lessons', lessonsRoutes);
routes.use('/users', userRoutes);

export default routes;
