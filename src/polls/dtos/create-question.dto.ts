import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QuestionTypes } from '../questions/question-types.enum';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(QuestionTypes)
  type?: QuestionTypes = QuestionTypes.TEXT;
}
