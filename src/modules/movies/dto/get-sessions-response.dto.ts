import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetSessionResponseDto } from './get-session-response.dto';

export class GetSessionsResponseDto {
  @ApiProperty({
    type: [GetSessionResponseDto],
    description: 'Array of sessions',
  })
  @Type(() => GetSessionResponseDto)
  sessions: GetSessionResponseDto[];

  constructor(sessions: any[]) {
    this.sessions = sessions.map(
      (session) => new GetSessionResponseDto(session),
    );
  }
}
