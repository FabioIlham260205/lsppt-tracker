import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

export class UpdateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
