import { IsString, IsNotEmpty } from 'class-validator';

export class EditTaskDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export default EditTaskDto;
