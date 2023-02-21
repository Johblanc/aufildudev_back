import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const now = Date.now();
    return next
      .handle()
      .pipe(
        map((value : { message : string, data : any}) => {
            console.log( `${context.getArgs()[0].method} | ${context.getArgs()[1].statusCode} | ${context.getArgs()[0].url}\nDelais : ${Date.now() - now}ms\n${value.message}`)
            return {
                statusCode : context.getArgs()[1].statusCode,
                timestamp: new Date().toISOString(),
                path: context.getArgs()[0].url,
                message : value.message,
                data : value.data,
            }
        }),
      );
  }
}