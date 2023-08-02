import { IsDateString, IsString } from 'class-validator';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate: string;

  participants: number[]; // User Ids
}
