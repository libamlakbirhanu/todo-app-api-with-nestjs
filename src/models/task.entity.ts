import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: new Date() })
  createdAt: Date;

  @ManyToOne(() => User, (author: User) => author.tasks)
  author: User;
}
