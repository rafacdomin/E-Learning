import ICreateAdminDTO from '../dtos/ICreateAdminDTO';
import Admin from '../infra/typeorm/entities/Admin';

export default interface IAdminsRepository {
  create(data: ICreateAdminDTO): Promise<Admin>;
  update(admin: Admin): Promise<Admin>;
  findByEmail(email: string): Promise<Admin | undefined>;
  findById(id: string): Promise<Admin | undefined>;
}
