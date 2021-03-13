import Admin from '@modules/admins/infra/typeorm/entities/Admin';
import Lesson from '@modules/lessons/infra/typeorm/entities/Lesson';
import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('courses')
class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @OneToMany(() => Lesson, lesson => lesson.course, {
    eager: true,
  })
  lessons: Lesson[];

  @Column()
  owner_id: string;

  @ManyToOne(() => Admin, { eager: true })
  @JoinColumn({ name: 'owner_id' })
  owner: Admin;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'image_url' })
  get_image_url(): string | null {
    return this.image ? `${process.env.API_URL}/files/${this.image}` : null;
  }
}

export default Course;
