import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Admin from '../infra/typeorm/entities/Admin';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';
import IAdminsRepository from '../repositories/IAdminsRepository';
import ICreateAdminDTO from '../dtos/ICreateAdminDTO';

@injectable()
export default class CreateAdminService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepo: IAdminsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
    role = '',
  }: ICreateAdminDTO): Promise<Admin> {
    const adminExists = await this.adminsRepo.findByEmail(email);

    if (adminExists) {
      throw new AppError('Email already used');
    }

    const passwordHash = await this.hashProvider.generateHash(password);

    const admin = await this.adminsRepo.create({
      name,
      email,
      password: passwordHash,
      role,
    });

    return admin;
  }
}
