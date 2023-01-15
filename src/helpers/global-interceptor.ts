import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export default class GlobalHeaderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            tap(() => {
                const res = context.switchToHttp().getResponse();
                res.setHeader('x-api-version', process.env.MICROSERVICE_API_VERSION);
            }),
        );
    }
}
