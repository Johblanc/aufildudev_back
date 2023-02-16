import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exept = exception.getResponse();
    if (typeof exept === "object")
    {
      response
        .status(status)
        .json({
          ...exept,
          timestamp: new Date().toISOString(),
          path: request.url
        });
    }
    else
    {
      response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: exept
        });
    }
  }
}