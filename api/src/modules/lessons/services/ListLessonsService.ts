import { inject, injectable } from 'tsyringe';
import ICourseRepository from '@modules/courses/repositories/ICourseRepository';
import AppError from '@shared/errors/AppError';
import Lesson from '../infra/typeorm/entities/Lesson';
import ILessonRepository from '../repositories/ILessonRepository';

@injectable()
export default class ListLessonService {
  constructor(
    @inject('LessonsRepository')
    private lessonsRepository: ILessonRepository,

    @inject('CourseRepository')
    private courseRepository: ICourseRepository,
  ) {}

  public async execute(course_id: string): Promise<Lesson[]> {
    const course = await this.courseRepository.findById(course_id);

    if (!course) {
      throw new AppError('Invalid course id');
    }

    return this.lessonsRepository.findByCourse(course_id);
  }
}
