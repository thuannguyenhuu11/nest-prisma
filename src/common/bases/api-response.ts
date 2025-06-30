import { HttpStatus } from '@nestjs/common';
import { ApiResponseKey } from 'src/enums/api-response-key.enum';

interface ApiResponseData<T, E = unknown> {
  [ApiResponseKey.STATUS]: boolean;
  [ApiResponseKey.CODE]: HttpStatus;
  [ApiResponseKey.DATA]?: T;
  [ApiResponseKey.ERRORS]?: E;
  [ApiResponseKey.MESSAGE]?: string;
  [ApiResponseKey.TIMESTAMP]: string;
}

export type TApiResponse<T, E = unknown> = ApiResponseData<T, E>;

export class ApiResponse {
  private static getTimeStamp(): string {
    return new Date().toISOString();
  }

  static ok<T>(
    data: T,
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.OK,
  ): ApiResponseData<T> {
    return {
      [ApiResponseKey.STATUS]: true,
      [ApiResponseKey.CODE]: httpStatus,
      [ApiResponseKey.DATA]: data,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.TIMESTAMP]: this.getTimeStamp(),
    };
  }

  static error<E>(
    errors: E,
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): ApiResponseData<E> {
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
