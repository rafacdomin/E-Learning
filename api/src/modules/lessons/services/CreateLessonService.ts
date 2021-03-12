import { inject, injectable } from 'tsyringe';
import ICourseRepository from '@modules/courses/repositories/ICourseRepository';
import AppError from '@shared/errors/AppError';
import ICreateLessonDTO from '../dtos/ICreateLessonDTO';
import Lesson from '../infra/typeorm/entities/Lesson';
import ILessonRepository from '../repositories/ILessonRepository';

@injectable()
export default class CreateLessonService {
  constructor(
    @inject('LessonsRepository')
    private lessonsRepository: ILessonRepository,

    @inject('CourseRepository')
    private courseRepository: ICourseRepository,
  ) {}

  public async execute(data: ICreateLessonDTO): Promise<Lesson> {
    const course = await this.courseRepository.findById(data.course_id);

    if (!course) {
      throw new AppError('Invalid course id');
    }

    return this.lessonsRepository.create(data);
  }
}
