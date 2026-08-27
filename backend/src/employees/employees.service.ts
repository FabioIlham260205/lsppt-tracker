import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const employees = await this.prisma.employee.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, name: true },
    });
    return { data: employees };
  }

  async create(dto: CreateEmployeeDto) {
    const existing = await this.prisma.employee.findFirst({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Employee name already exists');
    }
    const employee = await this.prisma.employee.create({
      data: { name: dto.name },
      select: { id: true, name: true },
    });
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const duplicate = await this.prisma.employee.findFirst({
      where: { name: dto.name, NOT: { id } },
    });
    if (duplicate) {
      throw new ConflictException('Employee name already exists');
    }
    const updated = await this.prisma.employee.update({
      where: { id },
      data: { name: dto.name },
      select: { id: true, name: true },
    });
    return updated;
  }

  async taskCount(id: number) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const count = await this.prisma.task.count({ where: { employeeId: id } });
    return { count };
  }

  async remove(id: number) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    await this.prisma.employee.delete({ where: { id } });
    return { message: 'Employee deleted successfully' };
  }
}
