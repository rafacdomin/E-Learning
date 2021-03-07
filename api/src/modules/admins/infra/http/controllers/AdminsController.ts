import CreateAdminService from '@modules/admins/services/createAdminService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AdminsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createAdmin = container.resolve(CreateAdminService);

    const admin = await createAdmin.execute({
      name,
      email,
      password,
    });

    return res.json(classToClass(admin));
  }
}
