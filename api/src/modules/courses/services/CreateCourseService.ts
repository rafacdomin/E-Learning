import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import Course from '../infra/typeorm/entities/Course';
import ICourseRepository from '../repositories/ICourseRepository';
import ICreateCourseDTO from '../dtos/ICreateCourseDTO';

@injectable()
export default class CreateCourseService {
  constructor(
    @inject('CourseRepository')
    private courseRepository: ICourseRepository,

    @inject('AdminsRepository')
    private adminsRepository: IAdminsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    name,
    image,
    owner_id,
  }: ICreateCourseDTO): Promise<Course> {
    const course = await this.courseRepository.findByName(name);
    const admin = await this.adminsRepository.findById(owner_id);

    if (course) {
      await this.storageProvider.deleteTmpFile(image);

      throw new AppError('Course name already exists');
    }

    if (!admin) {
      await this.storageProvider.deleteTmpFile(image);

      throw new AppError('Invalid owner_id');
    }

    await this.storageProvider.saveFile(image);

    return this.courseRepository.create({
      name,
      image,
      owner_id,
    });
  }
}
