import ICreateAdminDTO from '@modules/admins/dtos/ICreateAdminDTO';
import Admin from '../../infra/typeorm/entities/Admin';
import IAdminsRepository from '../IAdminsRepository';

export default class FakeAdminsRepository implements IAdminsRepository {
  private admins: Admin[] = [];

  public async create(data: ICreateAdminDTO): Promise<Admin> {
    const admin = new Admin();
    Object.assign(admin, data);
    admin.id = this.admins.length.toString();
    this.admins.push(admin);
    return admin;
  }

  public async update(admin: Admin): Promise<Admin> {
    const index = this.admins.findIndex(findAdmin => findAdmin.id === admin.id);
    this.admins[index] = admin;
    return admin;
  }

  public async findByEmail(email: string): Promise<Admin | undefined> {
    const admin = this.admins.find(findAdmin => findAdmin.email === email);
    return admin;
  }

  public async findById(id: string): Promise<Admin | undefined> {
    const admin = this.admins.find(findAdmin => findAdmin.id === id);
    return admin;
  }
}
