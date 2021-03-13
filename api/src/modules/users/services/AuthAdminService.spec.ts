import FakeHashProvider from '@modules/admins/providers/hashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthUserService from './AuthUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authUserService: AuthUserService;
let createUserService: CreateUserService;

describe('authUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authUserService = new AuthUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = await createUserService.execute({
      email: 'user@email.com',
      name: 'User',
      password: '123456',
    });

    const response = await authUserService.execute({
      email: 'user@email.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with an email that does not exist', async () => {
    await expect(
      authUserService.execute({
        email: 'EMAIL THAT DOES NOT EXIST',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with an wrong password', async () => {
    await createUserService.execute({
      email: 'user@email.com',
      name: 'User',
      password: '123456',
    });

    await expect(
      authUserService.execute({
        email: 'user@email.com',
        password: 'WRONG PASSWORD',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
