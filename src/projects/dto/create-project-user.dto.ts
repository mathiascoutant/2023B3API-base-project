import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectUserDto {
  //date de debut
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate!: Date;
  //date de fin
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate!: Date;

  @IsUUID(4)
  @IsNotEmpty()
  userId!: string;

  @IsUUID(4)
  @IsNotEmpty()
  projectId!: string;
}
