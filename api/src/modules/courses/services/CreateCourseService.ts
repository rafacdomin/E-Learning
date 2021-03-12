import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
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

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ name, image }: Request): Promise<Course> {
    const course = await this.courseRepository.findByName(name);

    if (course) {
      await this.storageProvider.deleteTmpFile(image);

      throw new AppError('Course name already exists');
    }

    await this.storageProvider.saveFile(image);

    return this.courseRepository.create({
      name,
      image,
    });
  }
}
