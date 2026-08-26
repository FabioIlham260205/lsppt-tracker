import { Module } from '@nestjs/common';
import { PhasesController } from './controllers/phases.controller';

@Module({
  controllers: [PhasesController],
})
export class CommonModule {}
