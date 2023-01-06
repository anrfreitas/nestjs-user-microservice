import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
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
import eventPattern from '../rabbitmq/eventPatterns';
import PublisherRabbitService from '../rabbitmq/publisher/publisher.service';
import MainService from './main.service';

@Controller('test')
class MainController {
    CACHING_TTL = 5;
    DEBUG = true;

    constructor(
        private readonly mainService: MainService,
        @Optional() @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly publisherRabbitService: PublisherRabbitService,
    ) {}

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'It executes hello world function in order to test the service' })
    @ApiResponse({ status: 200, description: 'Returns welcome message' })
    getWelcome(): any {
        return this.mainService.getWelcome();
    }

    @Post(':testParam')
    @HttpCode(200)
    @ApiOperation({ summary: 'It executes testing post function in order to test the service' })
    @ApiResponse({ status: 200, description: 'Returns the same testing params' })
    postTest(
        @Body() body: JSON,
        @Param('testParam') testParam: string,
        @Query('testQuery') testQuery: string,
    ): unknown {
        return {
            body,
            testQuery,
            testParam,
        };
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

    private checkCachingSystemOut(): Promise<void> {
        if (!this.cacheManager && !this.DEBUG) {
            Logger.warn(
                'Caching Disabled for authentication. We recommend you enable a Redis Cache Manager in your application.',
            );
        }
        return Promise.resolve();
    }
}

export default MainController;
