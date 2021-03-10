import AppError from '@shared/errors/AppError';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';

let fakeCourseRepository: FakeCourseRepository;
let createCourseService: CreateCourseService;

describe('CreateCourseService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
    createCourseService = new CreateCourseService(fakeCourseRepository);
  });

  it('should be able to create a new Course', async () => {
    const newCourse = await createCourseService.execute({
      name: 'new course',
      image: 'image_path',
    });

    expect(newCourse).toHaveProperty('id');
  });

  it('should not be able to create a new course with same name', async () => {
    await createCourseService.execute({
      name: 'new course',
      image: 'image_path',
    });

    await expect(
      createCourseService.execute({
        name: 'new course',
        image: 'image_path',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
