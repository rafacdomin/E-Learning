import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/admins/providers/hashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

@injectable()
export default class CreateAdminService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const userExists = await this.usersRepo.findByEmail(email);

    if (userExists) {
      throw new AppError('Email already used');
    }

    const passwordHash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepo.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}
