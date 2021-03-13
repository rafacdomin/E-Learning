import CreateCourseService from '@modules/courses/services/CreateCourseService';
import UpdateCourseService from '@modules/courses/services/UpdateCourseService';
import ListCourseService from '@modules/courses/services/ListCourseService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import DeleteCourseService from '@modules/courses/services/DeleteCourseService';

export default class CourseController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;

    const createCourseService = container.resolve(CreateCourseService);

    const course = await createCourseService.execute({
      owner_id: req.admin.id,
      name,
      image: req.file.filename,
    });

    return res.json(classToClass(course));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    const { id } = req.params;

    const updateCourseService = container.resolve(UpdateCourseService);

    const course = await updateCourseService.execute({
      id,
      name,
      admin_id: req.admin.id,
      image: req.file.filename,
    });

    return res.json(classToClass(course));
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const listCourseService = container.resolve(ListCourseService);

    const courses = await listCourseService.execute();

    return res.json(classToClass(courses));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteCourseService = container.resolve(DeleteCourseService);

    await deleteCourseService.execute({
      id,
      owner_id: req.admin.id,
    });

    return res.send();
  }
}
