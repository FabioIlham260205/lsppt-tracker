import { Injectable, NotFoundException } from '@nestjs/common';
import { formatDateOnly } from '../common/helpers/date.helper';
import { PrismaService } from '../prisma/prisma.service';

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
}
