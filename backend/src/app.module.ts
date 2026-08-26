import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { EmployeesModule } from './employees/employees.module';
import { HistoryModule } from './history/history.module';
import { LspptModule } from './lsppt/lsppt.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    EmployeesModule,
    LspptModule,
    TasksModule,
    HistoryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
