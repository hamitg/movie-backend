import { IsInt } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserWithIdDto extends UpdateUserDto {
  @IsInt()
  userId: number;
}
