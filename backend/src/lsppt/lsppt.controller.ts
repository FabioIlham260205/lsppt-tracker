import { Body, Controller, Post } from '@nestjs/common';
import { CreateLspptDto } from './dto/create-lsppt.dto';
import { LspptService } from './lsppt.service';

@Controller('lsppt')
export class LspptController {
  constructor(private readonly lspptService: LspptService) {}

  @Post()
  submit(@Body() dto: CreateLspptDto) {
    return this.lspptService.submit(dto);
  }
}
