import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isStatusValidForPhase } from '../common/constants/phases.constant';
import { parseDateOnly } from '../common/helpers/date.helper';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLspptDto } from './dto/create-lsppt.dto';

@Injectable()
export class LspptService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: CreateLspptDto) {
    for (const task of dto.tasks) {
      if (!isStatusValidForPhase(task.phase, task.status)) {
        throw new BadRequestException('Invalid status for phase');
      }
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employee_id },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const date = parseDateOnly(dto.date);

    try {
      await this.prisma.$transaction(async (tx) => {
        for (const task of dto.tasks) {
          const existingTask = await tx.task.findFirst({
            where: task.clickup_task_id
              ? {
                  employeeId: dto.employee_id,
                  clickupTaskId: task.clickup_task_id,
                }
              : { employeeId: dto.employee_id, title: task.title },
          });

          const dbTask =
            existingTask ??
            (await tx.task.create({
              data: {
                employeeId: dto.employee_id,
                clickupTaskId: task.clickup_task_id ?? null,
                title: task.title,
                clickupUrl: task.clickup_url ?? null,
              },
            }));

          const duplicate = await tx.taskProgress.findUnique({
            where: {
              taskId_date: { taskId: dbTask.id, date },
            },
          });
          if (duplicate) {
            throw new ConflictException(
              'Duplicate task progress for the same date',
            );
          }

          await tx.taskProgress.create({
            data: {
              taskId: dbTask.id,
              date,
              phase: task.phase,
              status: task.status,
            },
          });
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Duplicate task progress for the same date',
        );
      }
      throw error;
    }

    return { message: 'LSPPT saved successfully' };
  }
}
