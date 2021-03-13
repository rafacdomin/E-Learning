import 'reflect-metadata';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import CreateCourseService from '@modules/courses/services/CreateCourseService';
import FakeCourseRepository from '@modules/courses/repositories/fakes/FakeCourseRepository';
import AppError from '@shared/errors/AppError';
import FakeLessonRepository from '../repositories/fakes/FakeLessonRepository';
import CreateLessonService from './CreateLessonService';
import ListLessonsService from './ListLessonsService';

let fakeCourseRepository: FakeCourseRepository;
let fakeLessonRepository: FakeLessonRepository;
let fakeStorageProvider: FakeStorageProvider;
let createCourseService: CreateCourseService;
let createLessonService: CreateLessonService;
let listLessonsService: ListLessonsService;

describe('ListLessonService', () => {
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
    listLessonsService = new ListLessonsService(
      fakeLessonRepository,
      fakeCourseRepository,
    );
  });

  it('should be able to list lessons from a course', async () => {
    const newCourse = await createCourseService.execute({
      name: 'new course',
      image: 'image_path',
    });

    const lesson1 = await createLessonService.execute({
      course_id: newCourse.id,
      name: 'lesson1',
      duration: 60,
      description: 'A new lesson to new course',
      video_id: 'video_id',
    });

    const lesson2 = await createLessonService.execute({
      course_id: newCourse.id,
      name: 'lesson2',
      duration: 60,
      description: 'A new lesson to new course',
      video_id: 'video_id',
    });

    const lessons = await listLessonsService.execute(newCourse.id);

    expect(lessons).toHaveLength(2);
    expect(lessons[0]).toEqual(lesson1);
    expect(lessons[1]).toEqual(lesson2);
  });

  it('should not be able to list lessons of a unexistent course', async () => {
    await expect(
      listLessonsService.execute('unexistent_course_id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
