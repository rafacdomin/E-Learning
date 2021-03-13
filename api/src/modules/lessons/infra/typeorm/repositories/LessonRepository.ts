import ICreateLessonDTO from '@modules/lessons/dtos/ICreateLessonDTO';
import ILessonRepository from '@modules/lessons/repositories/ILessonRepository';
import { getRepository, Repository } from 'typeorm';
import Lesson from '../entities/Lesson';

export default class LessonRepository implements ILessonRepository {
  private ormRepo: Repository<Lesson>;

  constructor() {
    this.ormRepo = getRepository(Lesson);
  }

  public async create(data: ICreateLessonDTO): Promise<Lesson> {
    const lesson = this.ormRepo.create(data);
    return this.ormRepo.save(lesson);
  }

  public async update(lesson: Lesson): Promise<Lesson> {
    return this.ormRepo.save(lesson);
  }

  public async find(): Promise<Lesson[]> {
    return this.ormRepo.find();
  }

  public async findById(id: string): Promise<Lesson | undefined> {
    return this.ormRepo.findOne({ where: { id } });
  }

  public async findByCourse(course_id: string): Promise<Lesson[]> {
    return this.ormRepo.find({ where: { course_id } });
  }
}
