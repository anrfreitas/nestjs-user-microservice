import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import SubscriberRabbitModule from '../rabbitmq/subscriber/subscriber.module';
import PublisherRabbitModule from '../rabbitmq/publisher/publisher.module';
import TestModule from '../test/test.module';
import MainService from './main.service';
import MainController from './main.controller';

@Module({
    imports: [ConfigModule.forRoot(), SubscriberRabbitModule, PublisherRabbitModule, TestModule],
    controllers: [MainController],
    providers: [MainService],
})
class MainModule {}

export default MainModule;
