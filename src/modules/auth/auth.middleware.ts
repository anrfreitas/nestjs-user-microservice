import { HttpException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import AuthService, { CustomRequest } from './auth.service';

@Injectable()
class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthMiddleware.name);

    constructor(private readonly authService: AuthService) {}

    async use(req: CustomRequest, res: Response, next: NextFunction): Promise<boolean | void> {
        const sessionToken = this.getSessionToken(req);

        try {
            const user = await this.authService.authenticate(sessionToken);
            req.user = user;
            next();
        } catch (e) {
            throw new HttpException('Unauthenticated', 401);
        }
    }

    private getSessionToken(req: Request) {
        if (!req.headers.authorization) {
            this.logger.warn(
                'app.session-token Cookie was not found. Please ensure cookie-parser is configured on the server.',
            );

            throw new HttpException('Unauthenticated', 401);
        }

        return req.headers.authorization.replace('Bearer ', '').replace('bearer ', '');
    }
}
export default AuthMiddleware;
