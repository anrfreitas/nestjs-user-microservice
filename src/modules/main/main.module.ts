import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaService } from '@nestjs-prisma/database';
import SubscriberRabbitModule from '../rabbitmq/subscriber/subscriber.module';
import PublisherRabbitModule from '../rabbitmq/publisher/publisher.module';
import MainService from './main.service';
import MainController from './main.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SubscriberRabbitModule,
        PublisherRabbitModule,
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
