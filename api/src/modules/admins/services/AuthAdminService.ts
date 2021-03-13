import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import auth from '@config/auth';
import AppError from '@shared/errors/AppError';
import Admin from '../infra/typeorm/entities/Admin';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';
import IAdminsRepository from '../repositories/IAdminsRepository';

interface IRequestDTO {
  email: string;
  password: string;
}

interface Response {
  admin: Admin;
  token: string;
}

@injectable()
export default class authAdminService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepo: IAdminsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<Response> {
    const admin = await this.adminsRepo.findByEmail(email);

    if (!admin) {
      throw new AppError('User not found');
    }

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      admin.password,
    );

    if (!passwordMatches) {
      throw new AppError('User not found');
    }

    const token = sign({}, auth.jwt.secret, {
      subject: admin.id,
      expiresIn: auth.jwt.expires || '1d',
    });

    return { token, admin };
  }
}
