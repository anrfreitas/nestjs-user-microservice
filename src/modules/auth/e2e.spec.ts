import cookieParser from 'cookie-parser';
import {
    CACHE_MANAGER,
    Controller,
    Get,
    INestApplication,
    CacheModule,
    Module,
    MiddlewareConsumer,
    Req,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import moxios from 'moxios';
import { User } from '@nestjs-prisma/database';
import { Cache } from 'cache-manager';
import AuthMiddleware from './auth.middleware';
import AuthModule from './auth.module';

@Controller()
class TestController {
    @Get('user')
    test(@Req() req) {
        return req.user;
    }
}

@Module({
    imports: [AuthModule],
    controllers: [TestController],
})
class TestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('user');
    }
}

const user: Partial<User> = {
    id: 'test1234',
    name: 'John Doe',
    email: 'test1@test.com',
};

@Module({
    imports: [
        AuthModule,
        CacheModule.register({
            isGlobal: true,
        }),
    ],
    controllers: [TestController],
})
class TestModuleWithCache {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('user');
    }
}

describe('Auth Middleware', () => {
    let app: INestApplication;

    describe('Without Caching', () => {
        beforeEach(async () => {
            const testModule = await Test.createTestingModule({
                imports: [TestModule],
            }).compile();

            moxios.install();

            app = testModule.createNestApplication();
            app.use(cookieParser());
            app.init();
        });

        afterEach(() => {
            moxios.uninstall();
        });

        it('Returns error if no session cookie', () =>
            request(app.getHttpServer()).get('/user').expect(401));

        it('Fails if authentication service returns unauthenticated', async () => {
            moxios.stubOnce('GET', `${process.env.NEXTAUTH_URL}/api/auth/validate`, {
                status: 401,
                response: {},
            });

            await request(app.getHttpServer())
                .get('/user')
                .set('authorization', 'Bearer testtoken')
                .expect(401);
        });

        it('Passes if authentication service returns authenticated', async () => {
            moxios.stubOnce('GET', `${process.env.NEXTAUTH_URL}/api/auth/validate`, {
                status: 200,
                response: {
                    user,
                },
            });

            return request(app.getHttpServer())
                .get('/user')
                .set('authorization', 'Bearer testtoken')
                .expect(200)
                .expect((res) => res.body === user);
        });
    });

    describe('With Caching', () => {
        let cacheService: Cache;

        beforeEach(async () => {
            const testModule = await Test.createTestingModule({
                imports: [TestModuleWithCache],
            }).compile();

            moxios.install();

            cacheService = testModule.get<Cache>(CACHE_MANAGER);

            app = testModule.createNestApplication();
            app.use(cookieParser());
            app.init();
        });

        afterEach(() => {
            moxios.uninstall();
        });

        it('Checks the cache first', async () => {
            const spy = jest.spyOn(cacheService, 'get');

            moxios.stubOnce('GET', `${process.env.NEXTAUTH_URL}/api/auth/validate`, {
                status: 200,
                response: {
                    user,
                },
            });

            await request(app.getHttpServer())
                .get('/user')
                .set('authorization', 'Bearer testtoken')
                .expect(200)
                .expect((res) => res.body === user);

            expect(spy).toBeCalled();
        });

        it('Authenticates from cache if exists', async () => {
            jest.spyOn(cacheService, 'get').mockImplementationOnce(async () => ({
                user,
            }));

            await request(app.getHttpServer())
                .get('/user')
                .set('authorization', 'Bearer testtoken')
                .expect(200)
                .expect((res) => res.body === user);

            expect(moxios.requests.mostRecent()).toBe(undefined);
        });
    });
});
