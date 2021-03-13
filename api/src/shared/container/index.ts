import { container } from 'tsyringe';
import '@modules/admins/providers';
import './providers';

import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import AdminsRepository from '@modules/admins/infra/typeorm/repositories/AdminsRepository';

import ICourseRepository from '@modules/courses/repositories/ICourseRepository';
import CourseRepository from '@modules/courses/infra/typeorm/repositories/CourseRepository';

import ILessonRepository from '@modules/lessons/repositories/ILessonRepository';
import LessonRepository from '@modules/lessons/infra/typeorm/repositories/LessonRepository';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

container.registerSingleton<IAdminsRepository>(
  'AdminsRepository',
  AdminsRepository,
);

container.registerSingleton<ICourseRepository>(
  'CourseRepository',
  CourseRepository,
);

container.registerSingleton<ILessonRepository>(
  'LessonsRepository',
  LessonRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
