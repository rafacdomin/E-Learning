import 'reflect-metadata';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import CreateCourseService from '@modules/courses/services/CreateCourseService';
import FakeCourseRepository from '@modules/courses/repositories/fakes/FakeCourseRepository';
import AppError from '@shared/errors/AppError';
import FakeAdminsRepository from '@modules/admins/repositories/fakes/FakeAdminsRepository';
import FakeHashProvider from '@modules/admins/providers/hashProvider/fakes/FakeHashProvider';
import CreateAdminService from '@modules/admins/services/CreateAdminService';
import FakeLessonRepository from '../repositories/fakes/FakeLessonRepository';
import CreateLessonService from './CreateLessonService';

let fakeCourseRepository: FakeCourseRepository;
let fakeLessonRepository: FakeLessonRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;
let createCourseService: CreateCourseService;
let createLessonService: CreateLessonService;

describe('CreateLessonService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
    fakeLessonRepository = new FakeLessonRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeAdminsRepository = new FakeAdminsRepository();
    fakeHashProvider = new FakeHashProvider();
    createAdminService = new CreateAdminService(
      fakeAdminsRepository,
      fakeHashProvider,
    );
    createCourseService = new CreateCourseService(
      fakeCourseRepository,
      fakeAdminsRepository,
      fakeStorageProvider,
    );
    createLessonService = new CreateLessonService(
      fakeLessonRepository,
      fakeCourseRepository,
    );
  });

  it('should be able to create a new Lesson', async () => {
    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });
    const newCourse = await createCourseService.execute({
      owner_id: admin.id,
      name: 'new course',
      image: 'image_path',
    });

    const lesson = await createLessonService.execute({
      course_id: newCourse.id,
      name: 'new lesson',
      duration: 60,
      description: 'A new lesson to new course',
      video_id: 'video_id',
    });

    expect(lesson).toHaveProperty('id');
    expect(lesson.course_id).toEqual(newCourse.id);
  });

  it('should not be able to create a lesson in a unexistent course', async () => {
    await expect(
      createLessonService.execute({
        course_id: 'unexistent_ID',
        name: 'new lesson',
        duration: 60,
        description: 'A new lesson to unexistent course',
        video_id: 'video_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
