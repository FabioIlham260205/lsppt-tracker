import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AddProgressDto } from './dto/add-progress.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id/history')
  findHistory(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findHistory(id);
  }

  @Post(':id/progress')
  addProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddProgressDto,
  ) {
    return this.tasksService.addProgress(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
