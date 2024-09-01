import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @Expose()
  @ApiProperty({
    example: 'okThbGciOiJIUzI1NiIsInR5cCI6IkpTKJ0...',
    description: 'JWT access token',
  })
  access_token: string;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
