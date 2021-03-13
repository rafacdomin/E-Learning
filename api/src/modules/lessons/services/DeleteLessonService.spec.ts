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
import ListLessonsService from './ListLessonsService';
import DeleteLessonService from './DeleteLessonService';

let fakeCourseRepository: FakeCourseRepository;
let fakeLessonRepository: FakeLessonRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;
let createCourseService: CreateCourseService;
let createLessonService: CreateLessonService;
let listLessonsService: ListLessonsService;
let deleteLessonsService: DeleteLessonService;

describe('DeleteLessonService', () => {
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
    listLessonsService = new ListLessonsService(
      fakeLessonRepository,
      fakeCourseRepository,
    );
    deleteLessonsService = new DeleteLessonService(
      fakeLessonRepository,
      fakeCourseRepository,
      fakeAdminsRepository,
    );
  });

  it('should be able to delete lessons from a course', async () => {
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
      name: 'lesson1',
      duration: 60,
      description: 'A new lesson to new course',
      video_id: 'video_id',
    });

    await deleteLessonsService.execute({
      id: lesson.id,
      course_id: newCourse.id,
      owner_id: admin.id,
    });

    const lessons = await listLessonsService.execute(newCourse.id);

    expect(lessons).toHaveLength(0);
  });

  it('should not be able to delete unexistent lessons', async () => {
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

    await expect(
      deleteLessonsService.execute({
        course_id: newCourse.id,
        id: 'unexistent id',
        owner_id: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete lessons of a unexistent course', async () => {
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
      name: 'lesson1',
      duration: 60,
      description: 'A new lesson to new course',
      video_id: 'video_id',
    });

    await expect(
      deleteLessonsService.execute({
        course_id: 'unexistent course',
        id: lesson.id,
        owner_id: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete lessons you do not own', async () => {
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
      name: 'lesson1',
      duration: 60,
      description: 'A new lesson to new course',
      video_id: 'video_id',
    });

    await expect(
      deleteLessonsService.execute({
        course_id: newCourse.id,
        id: lesson.id,
        owner_id: 'wrong owner',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete any lessons if you are master', async () => {
    const master = await createAdminService.execute({
      name: 'master',
      email: 'master@admin.com',
      password: 'password',
      role: 'master',
    });

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
      name: 'lesson1',
      duration: 60,
      description: 'A new lesson to new course',
      video_id: 'video_id',
    });

    await deleteLessonsService.execute({
      course_id: newCourse.id,
      id: lesson.id,
      owner_id: master.id,
    });

    const lessons = await listLessonsService.execute(newCourse.id);

    expect(lessons).toHaveLength(0);
  });
});
