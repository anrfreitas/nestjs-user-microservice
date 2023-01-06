import { Module } from '@nestjs/common';
import globalSettings from '../../../config';
import PublisherRabbitRegister from './publisher.register';
import PublisherRabbitService from './publisher.service';

@Module({
    imports: [PublisherRabbitRegister(globalSettings.RABBITMQ_DEFAULT_QUEUE())],
    controllers: [],
    providers: [PublisherRabbitService],
    exports: [PublisherRabbitService],
})
export default class PublisherRabbitModule {}
