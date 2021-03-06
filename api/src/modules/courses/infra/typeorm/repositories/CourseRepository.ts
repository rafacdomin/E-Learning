import ICreateCourseDTO from '@modules/courses/dtos/ICreateCourseDTO';
import ICourseRepository from '@modules/courses/repositories/ICourseRepository';
import { getRepository, Repository } from 'typeorm';
import Course from '../entities/Course';

export default class CourseRepository implements ICourseRepository {
  private ormRepo: Repository<Course>;

  constructor() {
    this.ormRepo = getRepository(Course);
  }

  public async delete(course: Course): Promise<void> {
    this.ormRepo.remove(course);
  }

  public async findByName(name: string): Promise<Course | undefined> {
    return this.ormRepo.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<Course | undefined> {
    return this.ormRepo.findOne({ where: { id } });
  }

  public async find(): Promise<Course[]> {
    return this.ormRepo.find();
  }

  public async create(data: ICreateCourseDTO): Promise<Course> {
    const course = this.ormRepo.create(data);
    return this.ormRepo.save(course);
  }

  public async update(course: Course): Promise<Course> {
    return this.ormRepo.save(course);
  }
}
