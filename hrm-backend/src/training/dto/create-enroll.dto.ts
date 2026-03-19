import { IsNumber, IsNotEmpty, IsString } from 'class-validator'

export class EnrollTrainingDto {
  @IsNumber() courseId: number;
}


export class TrainingFeedbackDto {
  @IsNumber() enrollmentId: number;
  @IsString() @IsNotEmpty() feedback: string;
}