import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';
import IUsersRepository from '../IUsersRepository';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, data);
    user.id = this.users.length.toString();
    this.users.push(user);
    return user;
  }

  public async update(user: User): Promise<User> {
    const index = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[index] = user;
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(finduser => finduser.email === email);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.id === id);
    return user;
  }
}
