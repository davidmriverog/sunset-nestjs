import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Result } from './http-result';
import { STATUS_CODES } from 'http';

export type HttpSuccessResult<T> = {
  status: string;
  message: string;
  data: T;
};

export type HttpFailedResult<T> = {
  status: string;
  message: string;
  error: T;
};

export type HttpResult<T> = HttpSuccessResult<T> | HttpFailedResult<T>;

export class HttpResponse {
  private jsonResult<T>(res: Response, code: number, data: HttpResult<T>) {
    return res.status(code).json(data);
  }

  response<T>(res: Response, data: Result<T>) {
    if (data.isFaliure) return this.fail(res, data);

    return this.ok(res, data);
  }

  ok<T>(res: Response, data: Result<T>) {
    return this.jsonResult(res, HttpStatus.OK, {
      status: STATUS_CODES[HttpStatus.OK],
      message: 'Operation Successful',
      data: data.value,
    });
  }

  fail<T>(res: Response, data: Result<T>) {
    return this.jsonResult(res, HttpStatus.BAD_REQUEST, {
      status: STATUS_CODES[HttpStatus.BAD_REQUEST],
      message: 'Operation Faliure',
      error: data.error,
    });
  }
}
