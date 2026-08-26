import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import { PHASES } from '../../common/constants/phases.constant';

export class LspptTaskDto {
  @IsString()
  @NotEquals('')
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  clickup_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  clickup_task_id?: string;

  @IsIn(Object.keys(PHASES))
  phase: string;

  @IsString()
  @NotEquals('')
  @MaxLength(50)
  status: string;
}

export class CreateLspptDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employee_id: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be a valid date in YYYY-MM-DD format',
  })
  date: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LspptTaskDto)
  tasks: LspptTaskDto[];
}
