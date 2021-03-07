import { getRepository, Repository } from 'typeorm';

import ICreateAdminDTO from '@modules/admins/dtos/ICreateAdminDTO';
import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import Admin from '../entities/Admin';

export default class AdminsRepository implements IAdminsRepository {
  private ormRepository: Repository<Admin>;

  constructor() {
    this.ormRepository = getRepository(Admin);
  }

  public async create(data: ICreateAdminDTO): Promise<Admin> {
    const admin = this.ormRepository.create(data);
    return this.ormRepository.save(admin);
  }

  public async update(admin: Admin): Promise<Admin> {
    return this.ormRepository.save(admin);
  }

  public async findByEmail(email: string): Promise<Admin | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public async findById(id: string): Promise<Admin | undefined> {
    return this.ormRepository.findOne(id);
  }
}
