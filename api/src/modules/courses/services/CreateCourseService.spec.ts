import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';

let fakeCourseRepository: FakeCourseRepository;
let fakeStorageProvider: FakeStorageProvider;
let createCourseService: CreateCourseService;

describe('CreateCourseService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createCourseService = new CreateCourseService(
      fakeCourseRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new Course', async () => {
    const spySaveFile = jest.spyOn(fakeStorageProvider, 'saveFile');
    const newCourse = await createCourseService.execute({
      name: 'new course',
      image: 'image_path',
    });

    expect(newCourse).toHaveProperty('id');
    expect(spySaveFile).toHaveBeenCalledWith('image_path');
  });

  it('should not be able to create a new course with same name', async () => {
    const spyDeleteTmpFile = jest.spyOn(fakeStorageProvider, 'deleteTmpFile');
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
    expect(spyDeleteTmpFile).toHaveBeenCalledWith('image_path');
  });
});
