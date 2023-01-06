import { DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import globalSettings from '../../../config';

const SubscriberRabbitRegister = (queueName: string): DynamicModule =>
    ClientsModule.register([
        {
            name: globalSettings.RABBITMQ_CLIENT_PROXY_TOKEN(),
            transport: Transport.RMQ,
            options: {
                urls: [
                    `amqp://${globalSettings.RABBITMQ_USERNAME()}:${globalSettings.RABBITMQ_PASSWORD()}@${globalSettings.RABBITMQ_HOST()}:${globalSettings.RABBITMQ_PORT()}`,
                ],
                queue: queueName,
                queueOptions: {
                    durable: false,
                },
            },
        },
    ]);

export default SubscriberRabbitRegister;
