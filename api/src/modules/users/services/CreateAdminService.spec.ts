import FakeHashProvider from '@modules/admins/providers/hashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const newUser = await createUserService.execute({
      email: 'user@email.com',
      name: 'User',
      password: '123456',
    });

    expect(newUser).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email', async () => {
    await createUserService.execute({
      email: 'user@email.com',
      name: 'User',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        email: 'user@email.com',
        name: 'User',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
