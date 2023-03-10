import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@nestjs-prisma/database';
import SubscriberRabbitModule from '../rabbitmq/subscriber/subscriber.module';
import PublisherRabbitModule from '../rabbitmq/publisher/publisher.module';
import Schemas from '../../schemas';
import { MongooseModule, CacheModule } from '../../helpers/modules-export';
import TestService from './test.service';
import TestController from './test.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SubscriberRabbitModule,
        PublisherRabbitModule,
        MongooseModule,
        ...Schemas,
        CacheModule,
    ],
    controllers: [TestController],
    providers: [TestService, PrismaService],
})
class TestModule {}

export default TestModule;
