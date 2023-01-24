import {
    Controller,
    Get,
    Param,
    HttpCode,
    Logger,
    Optional,
    Inject,
    CACHE_MANAGER,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '@nestjs-prisma/database';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import eventPattern from '../rabbitmq/eventPatterns';
import PublisherRabbitService from '../rabbitmq/publisher/publisher.service';
import { Log, LogDocument } from '../../schemas/log.schema';
import TestService from './test.service';

@Controller('test')
class TestController {
    CACHING_TTL = 5;
    DEBUG = true;

    constructor(
        private readonly mainService: TestService,
        @Optional() @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly publisherRabbitService: PublisherRabbitService,
        private readonly prisma: PrismaService,
        @InjectModel(Log.name) private logModel: Model<LogDocument>,
    ) {}

    @Get('prisma')
    @HttpCode(200)
    @ApiOperation({ summary: 'It tests the queue system' })
    @ApiResponse({ status: 200, description: 'Returns message' })
    async testPrisma(): Promise<any> {
        return this.prisma.user.findMany();
    }

    @Get('queue/:name')
    @HttpCode(200)
    @ApiOperation({ summary: 'It tests the queue system' })
    @ApiResponse({ status: 200, description: 'Returns message' })
    async testQueueSystem(@Param('name') name: string): Promise<any> {
        await this.publisherRabbitService
            .publishNewMessage(eventPattern.testing, JSON.stringify({ name }))
            .then((queueResponse) => {
                if (queueResponse.status === 'error') {
                    // We don't have anything configured to export errors, so we are exporting to the console in this case
                    Logger.error(queueResponse.message.messageInfo);
                    throw new HttpException(
                        queueResponse.message,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            });

        return {
            message: 'The payload is being processed',
            status: 'success',
        };
    }

    @Get('/caching/:name')
    @HttpCode(200)
    @ApiOperation({ summary: 'It tests the caching system' })
    @ApiResponse({ status: 200, description: 'Returns cached name and timestamp' })
    async testCachingSystem(@Param('name') name: string): Promise<any> {
        this.checkCachingSystemOut();
        const key = `name=${name}`;

        const res = await this.cacheManager.wrap(
            key,
            async () => {
                const value = {
                    name,
                    timestamp: Date.now(),
                };
                return value;
            },
            { ttl: this.CACHING_TTL },
        );

        return res;
    }

    @Get('/mongo/:name')
    @HttpCode(200)
    @ApiOperation({ summary: 'It tests the caching system' })
    @ApiResponse({ status: 200, description: 'Returns item from mongo db' })
    async testMongo(@Param('name') name: string): Promise<any> {
        const external_id = uuidv4();
        const createdLog = new this.logModel({
            context: 'MainController@testMongo',
            external_id,
            data: JSON.stringify({ name }),
        });

        await createdLog.save();

        return this.logModel.findOne({ external_id }).exec();

        // getting the last inserted
        // return this.logModel.findOne().sort({ _id: -1 }).exec();
    }

    private checkCachingSystemOut(): Promise<void> {
        if (!this.cacheManager && !this.DEBUG) {
            Logger.warn(
                'Caching Disabled for authentication. We recommend you enable a Redis Cache Manager in your application.',
            );
        }
        return Promise.resolve();
    }
}

export default TestController;
