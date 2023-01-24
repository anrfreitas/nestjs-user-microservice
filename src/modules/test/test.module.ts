import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaService } from '@nestjs-prisma/database';
import { MongooseModule } from '@nestjs/mongoose';
import SubscriberRabbitModule from '../rabbitmq/subscriber/subscriber.module';
import PublisherRabbitModule from '../rabbitmq/publisher/publisher.module';
import Schemas from '../../schemas';
import globalSettings from '../../config';
import TestService from './test.service';
import TestController from './test.controller';

const MONGO_CONNECTION_STRING = `mongodb://${globalSettings.MONGODB_USER()}:${globalSettings.MONGODB_PASSWORD()}@${globalSettings.MONGODB_HOST()}:${globalSettings.MONGODB_PORT()}`;

@Module({
    imports: [
        ConfigModule.forRoot(),
        SubscriberRabbitModule,
        PublisherRabbitModule,
        MongooseModule.forRoot(MONGO_CONNECTION_STRING, {
            dbName: globalSettings.MONGODB_DATABASE(),
            authSource: 'admin',
            readPreference: 'primary',
            directConnection: true,
        }),
        ...Schemas,
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: globalSettings.REDIS_HOST(),
            port: globalSettings.REDIS_PORT(),
        }),
    ],
    controllers: [TestController],
    providers: [TestService, PrismaService],
})
class TestModule {}

export default TestModule;
