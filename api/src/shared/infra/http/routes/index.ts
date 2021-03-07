import { Router } from 'express';

import adminRoutes from '@modules/admins/infra/http/routes/admin.routes';

const routes = Router();
routes.use('/admins', adminRoutes);

export default routes;
