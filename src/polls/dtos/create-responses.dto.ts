import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateResponsesDto {
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsNumber()
  @IsNotEmpty()
  optionId: number;
}
