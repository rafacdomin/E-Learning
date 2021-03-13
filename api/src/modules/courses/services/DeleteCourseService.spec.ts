import 'reflect-metadata';
import FakeHashProvider from '@modules/admins/providers/hashProvider/fakes/FakeHashProvider';
import FakeAdminsRepository from '@modules/admins/repositories/fakes/FakeAdminsRepository';
import CreateAdminService from '@modules/admins/services/CreateAdminService';
import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';
import DeleteCourseService from './DeleteCourseService';
import ListCourseService from './ListCourseService';

let fakeCourseRepository: FakeCourseRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;
let createCourseService: CreateCourseService;
let deleteCourseService: DeleteCourseService;
let listCourseService: ListCourseService;

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
    deleteCourseService = new DeleteCourseService(
      fakeCourseRepository,
      fakeAdminsRepository,
      fakeStorageProvider,
    );
    listCourseService = new ListCourseService(fakeCourseRepository);
  });

  it('should be able to delete a course', async () => {
    const spyDeleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
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

    await deleteCourseService.execute({
      id: newCourse.id,
      owner_id: admin.id,
    });

    const courses = await listCourseService.execute();

    expect(courses).toHaveLength(0);
    expect(spyDeleteFile).toHaveBeenCalledWith('image_path');
  });

  it('should not be able to delete a course that does not exist', async () => {
    await expect(
      deleteCourseService.execute({
        id: 'unexistend id',
        owner_id: 'unexistend owner id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a course that you do not own', async () => {
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

    await expect(
      deleteCourseService.execute({
        id: newCourse.id,
        owner_id: 'wrong owner id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete any course if you are master', async () => {
    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });

    const master = await createAdminService.execute({
      name: 'master',
      email: 'master@admin.com',
      password: 'password',
      role: 'master',
    });

    const newCourse = await createCourseService.execute({
      name: 'new course',
      image: 'image_path',
      owner_id: admin.id,
    });

    await deleteCourseService.execute({
      id: newCourse.id,
      owner_id: master.id,
    });

    const courses = await listCourseService.execute();

    expect(courses).toHaveLength(0);
  });
});
