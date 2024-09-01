import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { handlePrismaError } from '../constants/prisma-errors.constants';

@Injectable()
export class ResponseFormatInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((response) => {
        const data = response.data || response;
        const message =
          response.message || (statusCode >= 400 ? 'Error' : 'Success');
        return {
          statusCode,
          message,
          timestamp: new Date().toISOString(),
          path: request.url,
          data,
        } as ApiResponse<T>;
      }),
      catchError((err) => {
        const prismaMessage = handlePrismaError(err);

        const errorResponse: ApiResponse<null> = {
          statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: err.name || 'Internal server error',
          message:
            prismaMessage ||
            err.response?.message ||
            err.response ||
            err.message ||
            'Internal server error',
          timestamp: new Date().toISOString(),
          path: request.url,
          data: null,
        };

        return throwError(
          () => new HttpException(errorResponse, errorResponse.statusCode),
        );
      }),
    );
  }
}
