import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';
import UpdateCourseService from './UpdateCourseService';

let fakeCourseRepository: FakeCourseRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateCourseService: UpdateCourseService;
let createCourseService: CreateCourseService;

describe('UpdateCourseService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateCourseService = new UpdateCourseService(
      fakeCourseRepository,
      fakeStorageProvider,
    );
    createCourseService = new CreateCourseService(
      fakeCourseRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a Course', async () => {
    const newCourse = await createCourseService.execute({
      name: 'new course',
      image: 'image_name',
    });

    const updatedCourse = await updateCourseService.execute({
      id: newCourse.id,
      name: 'updated course',
    });

    expect(updatedCourse.id).toEqual(newCourse.id);
    expect(updatedCourse.name).toEqual('updated course');
  });

  it('should not be able to update a course that does not exist', async () => {
    const spyDeleteTmpFile = jest.spyOn(fakeStorageProvider, 'deleteTmpFile');

    await expect(
      updateCourseService.execute({
        id: 'inexistent ID',
        name: 'inexistent course',
        image: 'inexistent image',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(spyDeleteTmpFile).toHaveBeenCalledWith('inexistent image');
  });

  it('should delete old image from db when update', async () => {
    const spyDeleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const spySaveFile = jest.spyOn(fakeStorageProvider, 'saveFile');

    const newCourse = await createCourseService.execute({
      name: 'new course',
      image: 'image_name',
    });

    const updatedCourse = await updateCourseService.execute({
      id: newCourse.id,
      image: 'new image name',
    });

    expect(spyDeleteFile).toHaveBeenCalledWith(newCourse.image);
    expect(spySaveFile).toHaveBeenCalledWith(updatedCourse.image);
    expect(updatedCourse.image).toEqual('new image name');
  });
});
