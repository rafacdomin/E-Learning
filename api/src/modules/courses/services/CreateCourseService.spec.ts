import 'reflect-metadata';
import FakeHashProvider from '@modules/admins/providers/hashProvider/fakes/FakeHashProvider';
import FakeAdminsRepository from '@modules/admins/repositories/fakes/FakeAdminsRepository';
import CreateAdminService from '@modules/admins/services/CreateAdminService';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';

let fakeCourseRepository: FakeCourseRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;
let createCourseService: CreateCourseService;

describe('CreateCourseService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
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
  });

  it('should be able to create a new Course', async () => {
    const spySaveFile = jest.spyOn(fakeStorageProvider, 'saveFile');

    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });

    const newCourse = await createCourseService.execute({
      name: 'new course',
      image: 'image_path',
      owner_id: admin.id,
    });

    expect(newCourse).toHaveProperty('id');
    expect(newCourse.owner_id).toEqual(admin.id);
    expect(spySaveFile).toHaveBeenCalledWith('image_path');
  });

  it('should not be able to create a new course with same name', async () => {
    const spyDeleteTmpFile = jest.spyOn(fakeStorageProvider, 'deleteTmpFile');
    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });

    await createCourseService.execute({
      owner_id: admin.id,
      name: 'new course',
      image: 'image_path',
    });

    await expect(
      createCourseService.execute({
        owner_id: admin.id,
        name: 'new course',
        image: 'image_path',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(spyDeleteTmpFile).toHaveBeenCalledWith('image_path');
  });

  it('should not be able to create a course with a unexistent owner', async () => {
    await expect(
      createCourseService.execute({
        owner_id: 'unexistent_owner',
        name: 'new course',
        image: 'image_path',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
