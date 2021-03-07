import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import FakeAdminsRepository from '../repositories/fakes/FakeAdminsRepository';
import CreateAdminService from './createAdminService';

let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let createAdminService: CreateAdminService;

describe('CreateAdmin', () => {
  beforeEach(() => {
    fakeAdminsRepository = new FakeAdminsRepository();
    fakeHashProvider = new FakeHashProvider();
    createAdminService = new CreateAdminService(
      fakeAdminsRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new admin', async () => {
    const newAdmin = await createAdminService.execute({
      email: 'admin@email.com',
      name: 'Administrator',
      password: '123456',
    });

    expect(newAdmin).toHaveProperty('id');
  });

  it('should not be able to create a new admin with same email', async () => {
    await createAdminService.execute({
      email: 'admin@email.com',
      name: 'Administrator',
      password: '123456',
    });

    await expect(
      createAdminService.execute({
        email: 'admin@email.com',
        name: 'Administrator',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
