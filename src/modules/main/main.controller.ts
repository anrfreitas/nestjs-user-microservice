import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import MainService from './main.service';

@Controller('main')
class MainController {
    constructor(private readonly mainService: MainService) {}

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
}

export default MainController;
