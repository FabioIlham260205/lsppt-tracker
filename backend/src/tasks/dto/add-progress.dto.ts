import { IsIn, IsString, Matches } from 'class-validator';
import { PHASES } from '../../common/constants/phases.constant';

export class AddProgressDto {
  @IsIn(Object.keys(PHASES))
  phase: string;

  @IsString()
  status: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date: string;
}
