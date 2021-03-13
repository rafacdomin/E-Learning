import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import FakeAdminsRepository from '@modules/admins/repositories/fakes/FakeAdminsRepository';
import FakeHashProvider from '@modules/admins/providers/hashProvider/fakes/FakeHashProvider';
import CreateAdminService from '@modules/admins/services/CreateAdminService';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';
import UpdateCourseService from './UpdateCourseService';

let fakeCourseRepository: FakeCourseRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;
let updateCourseService: UpdateCourseService;
let createCourseService: CreateCourseService;

describe('UpdateCourseService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeAdminsRepository = new FakeAdminsRepository();
    fakeHashProvider = new FakeHashProvider();
    createAdminService = new CreateAdminService(
      fakeAdminsRepository,
      fakeHashProvider,
    );
    updateCourseService = new UpdateCourseService(
      fakeCourseRepository,
      fakeAdminsRepository,
      fakeStorageProvider,
    );
    createCourseService = new CreateCourseService(
      fakeCourseRepository,
      fakeAdminsRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a Course', async () => {
    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });

    const newCourse = await createCourseService.execute({
      owner_id: admin.id,
      name: 'new course',
      image: 'image_name',
    });

    const updatedCourse = await updateCourseService.execute({
      admin_id: admin.id,
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
        id: 'unexistent ID',
        admin_id: 'unexistent ID',
        name: 'unexistent course',
        image: 'unexistent image',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(
      updateCourseService.execute({
        id: 'unexistent_ID',
        admin_id: 'unexistent ID',
        name: 'unexistent course',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(spyDeleteTmpFile).toHaveBeenCalledTimes(1);
    expect(spyDeleteTmpFile).toHaveBeenCalledWith('unexistent image');
  });

  it('should delete old image from db when update', async () => {
    const spyDeleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const spySaveFile = jest.spyOn(fakeStorageProvider, 'saveFile');

    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });

    const newCourse = await createCourseService.execute({
      owner_id: admin.id,
      name: 'new course',
      image: 'image_name',
    });

    const updatedCourse = await updateCourseService.execute({
      id: newCourse.id,
      admin_id: admin.id,
      image: 'new image name',
    });

    expect(spyDeleteFile).toHaveBeenCalledWith('image_name');
    expect(spySaveFile).toHaveBeenCalledWith('new image name');
    expect(updatedCourse.image).toEqual('new image name');
  });

  it('should not be able to update a course that you dont own', async () => {
    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });

    const newCourse = await createCourseService.execute({
      owner_id: admin.id,
      name: 'new course',
      image: 'image_name',
    });

    await expect(
      updateCourseService.execute({
        admin_id: 'wrong_id',
        id: newCourse.id,
        name: 'new name',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
