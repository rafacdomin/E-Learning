import AuthAdminService from '@modules/admins/services/AuthAdminService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authAdmin = container.resolve(AuthAdminService);

    const admin = await authAdmin.execute({
      email,
      password,
    });

    return res.json(classToClass(admin));
  }
}
