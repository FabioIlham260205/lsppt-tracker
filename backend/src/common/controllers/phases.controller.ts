import { Controller, Get } from '@nestjs/common';
import { PHASES } from '../constants/phases.constant';

@Controller('phases')
export class PhasesController {
  @Get()
  findAll() {
    return { data: PHASES };
  }
}
