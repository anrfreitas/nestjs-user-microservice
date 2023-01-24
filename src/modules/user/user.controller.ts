import { Controller, Get, Body, HttpCode, Patch, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
class UserController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets users' })
    @ApiResponse({ status: 200, description: 'Returns users data' })
    getUsers(): any {
        return {};
    }

    @Get(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Gets user by ID' })
    @ApiResponse({ status: 200, description: 'Returns user data' })
    getUserById(@Param('id') id: string): any {
        return { id };
    }

    @Patch()
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates user profile' })
    @ApiResponse({ status: 200, description: 'Returns updated user data' })
    updateProfile(@Body() body: JSON): unknown {
        return {
            body,
        };
    }

    @Patch(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Updates user type' })
    @ApiResponse({ status: 200, description: 'Returns updated user data' })
    updateUser(@Body() body: JSON, @Param('id') id: string): unknown {
        return {
            id,
            body,
        };
    }
}

export default UserController;
