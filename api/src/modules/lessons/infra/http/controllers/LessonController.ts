import CreateLessonService from '@modules/lessons/services/CreateLessonService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CourseController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { course_id, name, description, duration, video_id } = req.body;

    const createLessonService = container.resolve(CreateLessonService);

    const lesson = await createLessonService.execute({
      course_id,
      name,
      description,
      duration,
      video_id,
    });

    return res.json(classToClass(lesson));
  }
}
