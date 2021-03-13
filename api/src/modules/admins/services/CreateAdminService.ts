import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Admin from '../infra/typeorm/entities/Admin';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';
import IAdminsRepository from '../repositories/IAdminsRepository';

interface IRequestDTO {
  name: string;
  password: string;
  email: string;
}

@injectable()
export default class CreateAdminService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepo: IAdminsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<Admin> {
    const adminExists = await this.adminsRepo.findByEmail(email);

    if (adminExists) {
      throw new AppError('Email already used');
    }

    const passwordHash = await this.hashProvider.generateHash(password);

    const admin = await this.adminsRepo.create({
      name,
      email,
      password: passwordHash,
    });

    return admin;
  }
}
