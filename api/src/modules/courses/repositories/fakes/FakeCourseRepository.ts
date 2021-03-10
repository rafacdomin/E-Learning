import ICreateCourseDTO from '@modules/courses/dtos/ICreateCourseDTO';
import Course from '@modules/courses/infra/typeorm/entities/Course';
import ICourseRepository from '../ICourseRepository';

export default class FakeCourseRepository implements ICourseRepository {
  private courses: Course[] = [];

  public async find(): Promise<Course[]> {
    return this.courses;
  }

  public async findByName(name: string): Promise<Course | undefined> {
    return this.courses.find(item => item.name === name);
  }

  public async findById(id: string): Promise<Course | undefined> {
    return this.courses.find(item => item.id === id);
  }

  public async create(data: ICreateCourseDTO): Promise<Course> {
    const course = new Course();
    Object.assign(course, data);
    course.id = this.courses.length.toString();
    this.courses.push(course);
    return course;
  }

  public async update(course: Course): Promise<Course> {
    const Index = this.courses.findIndex(item => item.id === course.id);
    this.courses[Index] = course;
    return course;
  }
}
