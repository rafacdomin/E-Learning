import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import FakeAdminsRepository from '@modules/admins/repositories/fakes/FakeAdminsRepository';
import FakeHashProvider from '@modules/admins/providers/hashProvider/fakes/FakeHashProvider';
import CreateAdminService from '@modules/admins/services/CreateAdminService';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';
import ListCourseService from './ListCourseService';

let fakeCourseRepository: FakeCourseRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;
let createCourseService: CreateCourseService;
let listCourseService: ListCourseService;

describe('ListCourseService', () => {
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
    listCourseService = new ListCourseService(fakeCourseRepository);
  });

  it('should be able to list courses', async () => {
    const admin = await createAdminService.execute({
      name: 'admin',
      email: 'admin@email.com',
      password: 'password',
    });

    await createCourseService.execute({
      owner_id: admin.id,
      name: 'course1',
      image: 'image_path',
    });

    await createCourseService.execute({
      owner_id: admin.id,
      name: 'course2',
      image: 'image_path',
    });

    const courses = await listCourseService.execute();

    expect(courses).toHaveLength(2);
  });
});
