import CreateCourseService from '@modules/courses/services/CreateCourseService';
import UpdateCourseService from '@modules/courses/services/UpdateCourseService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CourseController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;

    const createCourseService = container.resolve(CreateCourseService);

    const course = await createCourseService.execute({
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
      image: req.file.filename,
    });

    return res.json(classToClass(course));
  }
}
