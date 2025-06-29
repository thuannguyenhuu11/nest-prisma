import { HttpStatus } from '@nestjs/common';
import { ApiResponseKey } from 'src/enums/api-response-key.enum';

export class ApiResponse {
  private static getTimeStamp(): string {
    return new Date().toISOString();
  }

  static ok<T>(
    data: T,
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.OK,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS]: true,
      [ApiResponseKey.CODE]: httpStatus,
      [ApiResponseKey.DATA]: data,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.TIMESTAMP]: this.getTimeStamp(),
    };
  }

  static error<T>(
    errors: T,
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS]: false,
      [ApiResponseKey.CODE]: httpStatus,
      [ApiResponseKey.ERRORS]: errors,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.TIMESTAMP]: this.getTimeStamp(),
    };
  }

  static message(
    message: string,
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS]:
        httpStatus === HttpStatus.OK || httpStatus === HttpStatus.CREATED,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.TIMESTAMP]: this.getTimeStamp(),
      [ApiResponseKey.CODE]: httpStatus,
    };
  }
}
