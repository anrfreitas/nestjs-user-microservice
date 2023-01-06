import { Module } from '@nestjs/common';
import globalSettings from '../../../config';
import SubscriberRabbitRegister from './subscriber.register';
import SubscriberRabbitController from './subscriber.controller';

@Module({
    imports: [SubscriberRabbitRegister(globalSettings.RABBITMQ_DEFAULT_QUEUE())],
    controllers: [SubscriberRabbitController],
    providers: [],
})
export default class SubscriberRabbitModule {}
