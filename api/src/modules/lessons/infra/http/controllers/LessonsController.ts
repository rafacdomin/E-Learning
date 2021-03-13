import CreateLessonService from '@modules/lessons/services/CreateLessonService';
import ListLessonService from '@modules/lessons/services/ListLessonsService';
import UpdateLessonService from '@modules/lessons/services/UpdateLessonService';
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

  public async update(req: Request, res: Response): Promise<Response> {
    const { course_id, name, description, duration, video_id } = req.body;
    const { id } = req.params;

    const updateLessonService = container.resolve(UpdateLessonService);

    const lesson = await updateLessonService.execute({
      id,
      course_id,
      name,
      description,
      duration,
      video_id,
    });

    return res.json(classToClass(lesson));
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { course_id } = req.params;

    const listLessonsService = container.resolve(ListLessonService);

    const lessons = await listLessonsService.execute(course_id);

    return res.json(classToClass(lessons));
  }
}
