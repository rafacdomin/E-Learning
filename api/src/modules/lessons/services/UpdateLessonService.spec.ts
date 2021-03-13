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
import UpdateLessonService from './UpdateLessonService';

let fakeCourseRepository: FakeCourseRepository;
let fakeLessonRepository: FakeLessonRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;
let createCourseService: CreateCourseService;
let createLessonService: CreateLessonService;
let updateLessonService: UpdateLessonService;

describe('UpdateLessonService', () => {
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
    updateLessonService = new UpdateLessonService(
      fakeLessonRepository,
      fakeCourseRepository,
    );
  });

  it('should be able to update a Lesson', async () => {
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

    const updatedLessonName = await updateLessonService.execute({
      id: lesson.id,
      name: 'updated lesson',
    });

    const updatedLessonCourse = await updateLessonService.execute({
      id: lesson.id,
      course_id: newCourse.id,
    });

    expect(updatedLessonName.id).toEqual(lesson.id);
    expect(updatedLessonCourse.id).toEqual(lesson.id);
    expect(updatedLessonName.name).toEqual('updated lesson');
    expect(updatedLessonCourse.course_id).toEqual(newCourse.id);
  });

  it('should not be able to update a Lesson that does not exist', async () => {
    await expect(
      updateLessonService.execute({
        id: 'unexistent_ID',
        name: 'unexistent lesson',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a Lesson with a course id taht does not exist', async () => {
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

    await expect(
      updateLessonService.execute({
        id: lesson.id,
        course_id: 'unexistent_course_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
