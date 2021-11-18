import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from 'src/models/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateTaskDto from 'src/dto/createTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(userId): Promise<Task[]> {
    const results = await this.taskRepository.find({ relations: ['author'] });
    const tasks = results.filter((result) => result.author.id === userId);

    return tasks.map((task) => {
      return {
        ...task,
        author: { ...task.author, password: undefined },
      };
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id, {
      relations: ['author'],
    });
    if (task) {
      return {
        ...task,
        author: { ...task.author, password: undefined },
      };
    }
    throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  async createTask(taskDetail: CreateTaskDto, user): Promise<Task> {
    const newTask: Task = await this.taskRepository.create({
      ...taskDetail,
      createdAt: new Date(),
      author: user.id,
    });
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async updateTask(id: number, task) {
    await this.taskRepository.update(id, task);
    const updatedTask = await this.taskRepository.findOne(id, {
      relations: ['author'],
    });
    if (updatedTask) {
      return {
        ...updatedTask,
        author: { ...updatedTask.author, password: undefined },
      };
    }
    throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  async deleteTask(id: number) {
    const deleteResponse = await this.taskRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }
}
