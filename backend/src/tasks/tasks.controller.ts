import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id/history')
  findHistory(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findHistory(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
