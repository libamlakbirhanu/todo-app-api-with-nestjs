import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column()
  password: string;

  @OneToMany(() => Task, (task: Task) => task.author)
  tasks: Task[];
}
