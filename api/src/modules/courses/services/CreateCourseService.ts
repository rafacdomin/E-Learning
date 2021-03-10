import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Course from '../infra/typeorm/entities/Course';
import ICourseRepository from '../repositories/ICourseRepository';

interface Request {
  name: string;
  image: string;
}

@injectable()
export default class CreateCourseService {
  constructor(
    @inject('CourseRepository')
    private courseRepository: ICourseRepository,
  ) {}

  public async execute({ name, image }: Request): Promise<Course> {
    const course = await this.courseRepository.findByName(name);

    if (course) {
      throw new AppError('Course name already exists');
    }

    return this.courseRepository.create({
      name,
      image,
    });
  }
}
