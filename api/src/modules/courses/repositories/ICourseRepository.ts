import ICreateCourseDTO from '../dtos/ICreateCourseDTO';
import IUpdateCourseDTO from '../dtos/IUpdateCourseDTO';
import Course from '../infra/typeorm/entities/Course';

export default interface ICourseRepository {
  find(): Promise<Course[]>;
  findByName(name: string): Promise<Course | undefined>;
  findById(id: string): Promise<Course | undefined>;
  create(data: ICreateCourseDTO): Promise<Course>;
  update(course: IUpdateCourseDTO): Promise<Course>;
}
