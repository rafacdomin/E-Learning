import CreateCourseService from '@modules/courses/services/CreateCourseService';
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
}
