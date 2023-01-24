import { HttpService } from '@nestjs/axios';
import { User } from '@nestjs-prisma/database';
import { CACHE_MANAGER, Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { Request } from 'express';
import { Cache } from 'cache-manager';

export type CustomRequest = Request & { user: Partial<User> | null | undefined };

interface ValidationResponse {
    user: User;
    expires: number;
}

@Injectable()
class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private http: HttpService,
        @Optional() @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async authenticate(sessionToken: string): Promise<Partial<User>> {
        const cacheKey = this.getCacheKey(sessionToken);

        const user =
            (await this.checkAgaisntCache(cacheKey)) ||
            (await this.checkAgainstAuthService(sessionToken, cacheKey));

        if (user) {
            return Promise.resolve(user);
        }

        return Promise.reject();
    }

    private getCacheKey(token): string {
        return `auth.user.${token}`;
    }

    private async storeInCache(cacheKey: string, user: User): Promise<void> {
        if (!this.cacheManager) {
            this.logger.warn(
                'Caching Disabled for authentication. We recommend you enable a Redis Cache Manager in your application.',
            );
            return Promise.resolve();
        }

        await this.cacheManager.set(`auth.user.${cacheKey}`, user, { ttl: 1800 });
        return Promise.resolve();
    }

    private async checkAgaisntCache(cacheKey: string): Promise<User | undefined> {
        const cachedValue = this.cacheManager
            ? await this.cacheManager.get<User>(cacheKey)
            : undefined;
        return Promise.resolve(cachedValue);
    }

    private async checkAgainstAuthService(
        sessionToken: string,
        cacheKey: string,
    ): Promise<User | false> {
        return new Promise((resolve) => {
            const http$ = this.http.get<ValidationResponse>(
                `${process.env.NEXTAUTH_URL}/api/auth/validate`,
                {
                    headers: {
                        Cookie: `app.session-token=${sessionToken}`,
                    },
                },
            );

            http$.subscribe({
                next: async ({ data }) => {
                    await this.storeInCache(cacheKey, data.user);

                    resolve(data.user);
                },
                error: () => {
                    resolve(false);
                },
            });
        });
    }
}

export default AuthService;
