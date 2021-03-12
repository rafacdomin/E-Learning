import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import FakeCourseRepository from '../repositories/fakes/FakeCourseRepository';
import CreateCourseService from './CreateCourseService';
import ListCourseService from './ListCourseService';

let fakeCourseRepository: FakeCourseRepository;
let fakeStorageProvider: FakeStorageProvider;
let createCourseService: CreateCourseService;
let listCourseService: ListCourseService;

describe('ListCourseService', () => {
  beforeEach(() => {
    fakeCourseRepository = new FakeCourseRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createCourseService = new CreateCourseService(
      fakeCourseRepository,
      fakeStorageProvider,
    );
    listCourseService = new ListCourseService(fakeCourseRepository);
  });

  it('should be able to list courses', async () => {
    await createCourseService.execute({
      name: 'course1',
      image: 'image_path',
    });

    await createCourseService.execute({
      name: 'course2',
      image: 'image_path',
    });

    const courses = await listCourseService.execute();

    expect(courses).toHaveLength(2);
  });
});
