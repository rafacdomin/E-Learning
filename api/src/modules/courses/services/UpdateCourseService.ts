import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';
import IUpdateCourseDTO from '../dtos/IUpdateCourseDTO';
import Course from '../infra/typeorm/entities/Course';
import ICourseRepository from '../repositories/ICourseRepository';

@injectable()
export default class UpdateCourseService {
  constructor(
    @inject('CourseRepository')
    private courseRepository: ICourseRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(course: IUpdateCourseDTO): Promise<Course> {
    const courseExists = await this.courseRepository.findById(course.id);

    if (!courseExists) {
      if (course.image) {
        await this.storageProvider.deleteTmpFile(course.image);
      }

      throw new AppError('Course does not exists');
    }

    if (course.image) {
      await this.storageProvider.deleteFile(courseExists.image);
      await this.storageProvider.saveFile(course.image);
    }

    return this.courseRepository.update(course);
  }
}
