import { container } from 'tsyringe';

import CreateAdminService from '@modules/admins/services/CreateAdminService';

export default class Starter {
  public async createAdmin(): Promise<void> {
    const createAdminService = container.resolve(CreateAdminService);

    try {
      await createAdminService.execute({
        name: 'Administrator',
        email: 'admin@email.com',
        password: '123456',
        role: 'master',
      });
    } catch {
      console.log('[STARTER] - admin already exists, skipping...');
    }
  }
}
