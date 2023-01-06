import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import globalSettings from '../../../config';

type RabbitMQStatus = 'error' | 'success';

type RabbitMQConnectionStatus = {
    status: RabbitMQStatus;
    message: {
        applicationContext?: string;
        messageInfo: string;
    };
};

@Injectable()
export default class PublisherRabbitService {
    private HEALTH_CHECK_EVERY_MS = 15000;

    private lastHealthCheck: number;

    constructor(@Inject(globalSettings.RABBITMQ_CLIENT_PROXY_TOKEN()) private client: ClientProxy) {
        this.lastHealthCheck = Date.now() - this.HEALTH_CHECK_EVERY_MS;
    }

    async publishNewMessage(
        eventPattern: string,
        payload: string,
    ): Promise<RabbitMQConnectionStatus> {
        const rabbitMQConnectionStatus = await this.getRabbitMQHealthStatus();
        if (rabbitMQConnectionStatus.status === 'success') {
            this.client.emit(eventPattern, payload);
            return rabbitMQConnectionStatus;
        }

        /* In case the status is not 'success' we'd better to return the status of the service than throwing an exception
         * because if we have an exception in the microservice we'd get the whole application stopped. Exceptions must be
         * handled in the app which is not an Nest Microservice.
         */
        return rabbitMQConnectionStatus;
    }

    private async getRabbitMQHealthStatus(): Promise<RabbitMQConnectionStatus> {
        let connectionResponse = {
            status: 'success' as RabbitMQStatus,
            message: {
                applicationContext: 'RabbitMQ',
                messageInfo: 'The connection was stabilished successfully!',
            },
        };

        if (Date.now() - this.lastHealthCheck >= this.HEALTH_CHECK_EVERY_MS) {
            this.lastHealthCheck = Date.now();
            await this.client.connect().catch((errorMessage: string) => {
                connectionResponse = {
                    status: 'error' as RabbitMQStatus,
                    message: {
                        applicationContext: 'RabbitMQ',
                        messageInfo: errorMessage,
                    },
                };
            });
        }

        return connectionResponse;
    }
}
