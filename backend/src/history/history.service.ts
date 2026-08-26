import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { Prisma } from '@prisma/client';
import { formatDateOnly, parseDateOnly } from '../common/helpers/date.helper';
import { PrismaService } from '../prisma/prisma.service';
import { HistoryQueryDto } from './dto/history-query.dto';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(query: HistoryQueryDto): Prisma.TaskProgressWhereInput {
    const where: Prisma.TaskProgressWhereInput = {};

    if (query.employee_id) {
      where.task = { employeeId: query.employee_id };
    }

    const dateFilter: Prisma.DateTimeFilter = {};
    if (query.from) {
      dateFilter.gte = parseDateOnly(query.from);
    }
    if (query.to) {
      dateFilter.lte = parseDateOnly(query.to);
    }
    if (dateFilter.gte || dateFilter.lte) {
      where.date = dateFilter;
    }

    return where;
  }

  private fetchRows(query: HistoryQueryDto) {
    return this.prisma.taskProgress.findMany({
      where: this.buildWhere(query),
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        taskId: true,
        date: true,
        phase: true,
        status: true,
        task: {
          select: {
            title: true,
            clickupTaskId: true,
            clickupUrl: true,
            employee: { select: { name: true } },
          },
        },
      },
    });
  }

  async findAll(query: HistoryQueryDto) {
    const rows = await this.fetchRows(query);

    return {
      data: rows.map((row) => ({
        id: row.id,
        task_id: row.taskId,
        employee: row.task.employee.name,
        date: formatDateOnly(row.date),
        task: row.task.title,
        clickup_task_id: row.task.clickupTaskId,
        phase: row.phase,
        status: row.status,
      })),
    };
  }

  async export(query: HistoryQueryDto): Promise<Buffer> {
    const rows = await this.fetchRows(query);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'LSPPT Tracker';
    workbook.created = new Date();
    const sheet = workbook.addWorksheet('LSPPT Report');

    sheet.columns = [
      { header: 'Employee', key: 'employee', width: 20 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Task', key: 'task', width: 45 },
      { header: 'ClickUp ID', key: 'clickup_task_id', width: 16 },
      { header: 'ClickUp URL', key: 'clickup_url', width: 45 },
      { header: 'Phase', key: 'phase', width: 10 },
      { header: 'Status', key: 'status', width: 24 },
    ];

    for (const row of rows) {
      sheet.addRow({
        employee: row.task.employee.name,
        date: formatDateOnly(row.date),
        task: row.task.title,
        clickup_task_id: row.task.clickupTaskId ?? '',
        clickup_url: row.task.clickupUrl ?? '',
        phase: row.phase,
        status: row.status,
      });
    }

    sheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
