import 'reflect-metadata';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import CreateCourseService from '@modules/courses/services/CreateCourseService';
import FakeCourseRepository from '@modules/courses/repositories/fakes/FakeCourseRepository';
import AppError from '@shared/errors/AppError';
import FakeLessonRepository from '../repositories/fakes/FakeLessonRepository';
import CreateLessonService from './CreateLessonService';

let fakeCourseRepository: FakeCourseRepository;
let fakeLessonRepository: FakeLessonRepository;
let fakeStorageProvider: FakeStorageProvider;
let createCourseService: CreateCourseService;
let createLessonService: CreateLessonService;

describe('CreateLessonService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
    fakeLessonRepository = new FakeLessonRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createCourseService = new CreateCourseService(
      fakeCourseRepository,
      fakeStorageProvider,
    );
    createLessonService = new CreateLessonService(
      fakeLessonRepository,
      fakeCourseRepository,
    );
  });

  it('should be able to create a new Lesson', async () => {
    const newCourse = await createCourseService.execute({
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
