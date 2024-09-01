import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/roles.constants';

export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'ali', description: 'The username of the user' })
  username: string;

  @Expose()
  @ApiProperty({ example: 25, description: 'The age of the user' })
  age: number;

  @Expose()
  @ApiProperty({
    example: ROLES.CUSTOMER,
    description: 'The role of the user',
    enum: ROLES,
  })
  role: number;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
