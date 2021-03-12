import ICreateLessonDTO from '../dtos/ICreateLessonDTO';
import Lesson from '../infra/typeorm/entities/Lesson';

export default interface ILessonRepository {
  create(data: ICreateLessonDTO): Promise<Lesson>;
  update(lesson: Lesson): Promise<Lesson>;
  find(): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | undefined>;
  findByCourse(course_id: string): Promise<Lesson[]>;
}
