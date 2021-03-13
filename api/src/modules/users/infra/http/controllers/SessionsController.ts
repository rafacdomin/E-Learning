import AuthUserService from '@modules/users/services/AuthUserService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authUser = container.resolve(AuthUserService);

    const { user, token } = await authUser.execute({
      email,
      password,
    });

    return res.json({ user: classToClass(user), token });
  }
}
