import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaService } from '@nestjs-prisma/database';
import { MongooseModule } from '@nestjs/mongoose';
import SubscriberRabbitModule from '../rabbitmq/subscriber/subscriber.module';
import PublisherRabbitModule from '../rabbitmq/publisher/publisher.module';
import Schemas from '../../schemas';
import globalSettings from '../../config';
import MainService from './main.service';
import MainController from './main.controller';

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
            host: 'zero_redis',
            port: 6379,
        }),
    ],
    controllers: [MainController],
    /**
     * Small usage example of Data Warehouse Prisma Instance
     */
    providers: [MainService, PrismaService],
})
class MainModule {}

export default MainModule;
