import { Module } from '@nestjs/common';
import { LspptController } from './lsppt.controller';
import { LspptService } from './lsppt.service';

@Module({
  controllers: [LspptController],
  providers: [LspptService],
})
export class LspptModule {}
