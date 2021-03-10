import { Router } from 'express';

import adminRoutes from '@modules/admins/infra/http/routes/admin.routes';
import courseRoutes from '@modules/courses/infra/http/routes/courses.routes';

const routes = Router();
routes.use('/admins', adminRoutes);
routes.use('/courses', courseRoutes);

export default routes;
