import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import globalSettings from './config';
import MainModule from './modules/main/main.module';
import GlobalHeaderInterceptor from './helpers/global-interceptor';

async function setupSwagger(app) {
    const config = new DocumentBuilder()
        .setTitle(globalSettings.MICROSERVICE_APP_CONTEXT())
        .setDescription(`The ${globalSettings.MICROSERVICE_APP_CONTEXT()} API description`)
        .setVersion(globalSettings.MICROSERVICE_API_VERSION())
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalSettings.MICROSERVICE_GLOBAL_PREFIX()}/swagger`, app, document);
}

async function startApp(app: INestApplication): Promise<void> {
    app.setGlobalPrefix(globalSettings.MICROSERVICE_GLOBAL_PREFIX());
    app.use(cookieParser());
    app.useGlobalInterceptors(new GlobalHeaderInterceptor());
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: 422,
            transform: true,
        }),
    );
    await setupSwagger(app);
    await app.listen(globalSettings.MICROSERVICE_PORT());
}

async function startAllMicroservices(app: INestApplication): Promise<void> {
    await app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [
                `amqp://${globalSettings.RABBITMQ_USERNAME()}:${globalSettings.RABBITMQ_PASSWORD()}@${globalSettings.RABBITMQ_HOST()}:${globalSettings.RABBITMQ_PORT()}`,
            ],
            queue: globalSettings.RABBITMQ_DEFAULT_QUEUE(),
            queueOptions: {
                durable: false,
            },
            prefetchCount: Number(globalSettings.RABBITMQ_PREFETCH_COUNT()),
            noAck: false,
        },
    });

    await app.startAllMicroservices();
}

async function bootstrap() {
    const app = await NestFactory.create(MainModule);
    await startApp(app);
    await startAllMicroservices(app);
}

bootstrap();
