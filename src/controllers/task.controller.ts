import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from 'src/services/task.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import CreateTaskDto from '../dto/createTask.dto';
import EditTaskDto from '../dto/editTask.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  addTask(@Body() taskDetail: CreateTaskDto, @Req() req): any {
    const task = this.taskService.createTask(taskDetail, req.user);

    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getTasks(@Req() req) {
    const tasks = await this.taskService.findAll(req.user.id);

    return { tasks };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTask(@Param('id') id: string) {
    const task = await this.taskService.findOne(+id);

    return { task };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('complete/:id')
  async markTaskComplete(@Param('id') id: string) {
    const task = await this.taskService.updateTask(+id, {
      completed: true,
    });

    return { task };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTask(@Body() body: EditTaskDto, @Param('id') id: string) {
    const task = await this.taskService.updateTask(+id, {
      ...body,
    });

    return { task };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteTask(@Param('id') id: string) {
    const task = await this.taskService.deleteTask(+id);

    return { task };
  }
}
