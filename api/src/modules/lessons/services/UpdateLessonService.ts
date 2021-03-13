import { inject, injectable } from 'tsyringe';
import ICourseRepository from '@modules/courses/repositories/ICourseRepository';
import AppError from '@shared/errors/AppError';
import IUpdateLessonDTO from '../dtos/IUpdateLessonDTO';
import Lesson from '../infra/typeorm/entities/Lesson';
import ILessonRepository from '../repositories/ILessonRepository';

@injectable()
export default class UpdateLessonService {
  constructor(
    @inject('LessonsRepository')
    private lessonsRepository: ILessonRepository,

    @inject('CourseRepository')
    private courseRepository: ICourseRepository,
  ) {}

  public async execute(data: IUpdateLessonDTO): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findById(data.id);

    if (!lesson) {
      throw new AppError('Invalid lesson id');
    }

    if (data.course_id) {
      const course = await this.courseRepository.findById(data.course_id);

      if (!course) {
        throw new AppError('Invalid course id');
      }
    }

    Object.assign(lesson, data);

    return this.lessonsRepository.update(lesson);
  }
}
