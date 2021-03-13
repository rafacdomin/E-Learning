import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import ICourseRepository from '@modules/courses/repositories/ICourseRepository';
import ILessonRepository from '../repositories/ILessonRepository';

interface Request {
  id: string;
  owner_id: string;
  course_id: string;
}

@injectable()
export default class DeleteLessonService {
  constructor(
    @inject('LessonsRepository')
    private lessonsRepository: ILessonRepository,

    @inject('CourseRepository')
    private coursesRepository: ICourseRepository,

    @inject('AdminsRepository')
    private adminsRepository: IAdminsRepository,
  ) {}

  public async execute({ id, owner_id, course_id }: Request): Promise<void> {
    const course = await this.coursesRepository.findById(course_id);
    const admin = await this.adminsRepository.findById(owner_id);

    if (!course) {
      throw new AppError('Invalid course id');
    }

    const lesson = await this.lessonsRepository.findById(id);

    if (!lesson) {
      throw new AppError('Invalid lesson id');
    }

    if (!admin || (admin.id !== course.owner_id && admin.role !== 'master')) {
      throw new AppError('User does not have permission');
    }

    await this.lessonsRepository.delete(lesson);
  }
}
