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

  public async execute(data: IUpdateCourseDTO): Promise<Course> {
    const course = await this.courseRepository.findById(data.id);

    if (!course) {
      if (data.image) {
        await this.storageProvider.deleteTmpFile(data.image);
      }

      throw new AppError('Course does not exists');
    }

    if (data.image) {
      await this.storageProvider.deleteFile(course.image);
      await this.storageProvider.saveFile(data.image);
      course.image = data.image;
    }

    Object.assign(course, data);

    return this.courseRepository.update(course);
  }
}
