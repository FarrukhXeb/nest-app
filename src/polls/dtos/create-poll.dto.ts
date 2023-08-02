import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  startDate?: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsArray()
  participants: number[]; // User Ids
}
