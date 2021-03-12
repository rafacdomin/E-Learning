import { container } from 'tsyringe';
import '@modules/admins/providers';
import './providers';

import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import AdminsRepository from '@modules/admins/infra/typeorm/repositories/AdminsRepository';

import ICourseRepository from '@modules/courses/repositories/ICourseRepository';
import CourseRepository from '@modules/courses/infra/typeorm/repositories/CourseRepository';

container.registerSingleton<IAdminsRepository>(
  'AdminsRepository',
  AdminsRepository,
);

container.registerSingleton<ICourseRepository>(
  'CourseRepository',
  CourseRepository,
);
