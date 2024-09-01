import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../modules/users/dto/user-response.dto';

export class RegisterResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'ali', description: 'Username of the user' })
  username: string;

  @Expose()
  @ApiProperty({ example: 25, description: 'Age of the user' })
  age: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Role of the user' })
  role: number;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
