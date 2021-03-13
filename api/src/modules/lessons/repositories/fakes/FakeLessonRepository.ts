import ICreateLessonDTO from '@modules/lessons/dtos/ICreateLessonDTO';
import Lesson from '@modules/lessons/infra/typeorm/entities/Lesson';
import ILessonRepository from '../ILessonRepository';

export default class FakeLessonRepository implements ILessonRepository {
  private lessons: Lesson[] = [];

  public async create(data: ICreateLessonDTO): Promise<Lesson> {
    const lesson = new Lesson();
    lesson.id = this.lessons.length.toString();
    Object.assign(lesson, data);
    this.lessons.push(lesson);
    return lesson;
  }

  public async update(lesson: Lesson): Promise<Lesson> {
    const index = this.lessons.findIndex(
      findLesson => findLesson.id === lesson.id,
    );
    this.lessons[index] = lesson;
    return lesson;
  }

  public async find(): Promise<Lesson[]> {
    return this.lessons;
  }

  public async findById(id: string): Promise<Lesson | undefined> {
    return this.lessons.find(findLesson => findLesson.id === id);
  }

  public async findByCourse(course_id: string): Promise<Lesson[]> {
    return this.lessons.filter(
      findLesson => findLesson.course_id === course_id,
    );
  }
}
