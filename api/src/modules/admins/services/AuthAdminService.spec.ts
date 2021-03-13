import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import FakeAdminsRepository from '../repositories/fakes/FakeAdminsRepository';
import AuthAdminService from './AuthAdminService';
import CreateAdminService from './CreateAdminService';

let fakeAdminsRepository: FakeAdminsRepository;
let fakeHashProvider: FakeHashProvider;
let authAdminService: AuthAdminService;
let createAdminService: CreateAdminService;

describe('authAdminService', () => {
  beforeEach(() => {
    fakeAdminsRepository = new FakeAdminsRepository();
    fakeHashProvider = new FakeHashProvider();
    authAdminService = new AuthAdminService(
      fakeAdminsRepository,
      fakeHashProvider,
    );
    createAdminService = new CreateAdminService(
      fakeAdminsRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate a admin user', async () => {
    const admin = await createAdminService.execute({
      email: 'admin@email.com',
      name: 'Administrator',
      password: '123456',
    });

    const response = await authAdminService.execute({
      email: 'admin@email.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.admin).toEqual(admin);
  });

  it('should not be able to authenticate with an email that does not exist', async () => {
    await expect(
      authAdminService.execute({
        email: 'EMAIL THAT DOES NOT EXIST',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with an wrong password', async () => {
    await createAdminService.execute({
      email: 'admin@email.com',
      name: 'Administrator',
      password: '123456',
    });

    await expect(
      authAdminService.execute({
        email: 'admin@email.com',
        password: 'WRONG PASSWORD',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
