import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isStatusValidForPhase } from '../common/constants/phases.constant';
import { formatDateOnly, parseDateOnly } from '../common/helpers/date.helper';
import { PrismaService } from '../prisma/prisma.service';
import { AddProgressDto } from './dto/add-progress.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findHistory(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        progress: {
          orderBy: { date: 'asc' },
          select: { date: true, phase: true, status: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      data: task.progress.map((progress) => ({
        date: formatDateOnly(progress.date),
        phase: progress.phase,
        status: progress.status,
      })),
    };
  }

  async remove(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }

  async addProgress(taskId: number, dto: AddProgressDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!isStatusValidForPhase(dto.phase, dto.status)) {
      throw new BadRequestException('Invalid status for phase');
    }

    const date = parseDateOnly(dto.date);

    const duplicate = await this.prisma.taskProgress.findUnique({
      where: { taskId_date: { taskId, date } },
    });
    if (duplicate) {
      throw new ConflictException('Progress for this date already exists');
    }

    await this.prisma.taskProgress.create({
      data: { taskId, date, phase: dto.phase, status: dto.status },
    });

    return { message: 'Progress updated successfully' };
  }
}
