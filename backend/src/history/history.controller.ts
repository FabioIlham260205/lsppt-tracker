import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { HistoryQueryDto } from './dto/history-query.dto';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  findAll(@Query() query: HistoryQueryDto) {
    return this.historyService.findAll(query);
  }

  @Get('export')
  async export(@Query() query: HistoryQueryDto, @Res() res: Response) {
    const buffer = await this.historyService.export(query);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="lsppt-history.xlsx"',
    );
    res.end(buffer);
  }
}
