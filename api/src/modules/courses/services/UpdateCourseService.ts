import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';
import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import IUpdateCourseDTO from '../dtos/IUpdateCourseDTO';
import Course from '../infra/typeorm/entities/Course';
import ICourseRepository from '../repositories/ICourseRepository';

@injectable()
export default class UpdateCourseService {
  constructor(
    @inject('CourseRepository')
    private courseRepository: ICourseRepository,

    @inject('AdminsRepository')
    private adminsRepository: IAdminsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(data: IUpdateCourseDTO): Promise<Course> {
    const course = await this.courseRepository.findById(data.id);
    const admin = await this.adminsRepository.findById(data.admin_id);

    if (!course) {
      if (data.image) {
        await this.storageProvider.deleteTmpFile(data.image);
      }

      throw new AppError('Course does not exists');
    }

    if (!admin || (course.owner_id !== admin.id && admin.role !== 'master')) {
      if (data.image) {
        await this.storageProvider.deleteTmpFile(data.image);
      }

      throw new AppError('User do not have permission');
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
