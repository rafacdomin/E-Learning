import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import ICourseRepository from '../repositories/ICourseRepository';

interface Request {
  id: string;
  owner_id: string;
}

@injectable()
export default class DeleteCourseService {
  constructor(
    @inject('CourseRepository')
    private courseRepository: ICourseRepository,

    @inject('AdminsRepository')
    private adminsRepository: IAdminsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ id, owner_id }: Request): Promise<void> {
    const course = await this.courseRepository.findById(id);
    const admin = await this.adminsRepository.findById(owner_id);

    if (!course) {
      throw new AppError('Invalid course id');
    }

    if (!admin || (admin.id !== course.owner_id && admin.role !== 'master')) {
      throw new AppError('User does not have permission');
    }

    await this.storageProvider.deleteFile(course.image);
    await this.courseRepository.delete(course);
  }
}
