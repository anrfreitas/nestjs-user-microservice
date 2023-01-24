import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@nestjs-prisma/database';
import SubscriberRabbitModule from '../rabbitmq/subscriber/subscriber.module';
import PublisherRabbitModule from '../rabbitmq/publisher/publisher.module';
import Schemas from '../../schemas';
import { MongooseModule, CacheModule } from '../../helpers/modules-export';
import UserController from './user.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SubscriberRabbitModule,
        PublisherRabbitModule,
        MongooseModule,
        ...Schemas,
        CacheModule,
    ],
    controllers: [UserController],
    providers: [PrismaService],
})
class UserModule {}

export default UserModule;
