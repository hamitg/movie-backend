import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../interfaces/api-response.interface';

export class ApiResponseSchema<T> implements ApiResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: null })
  error: string | null;

  @ApiProperty({ example: 1621234567890 })
  timestamp: string;

  @ApiProperty({ example: '/api/users' })
  path: string;

  @ApiProperty()
  data: T | null;
}
