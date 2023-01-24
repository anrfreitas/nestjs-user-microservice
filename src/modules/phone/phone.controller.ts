import { Controller, Body, HttpCode, Post, Delete, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('phone')
class PhoneController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    @Post()
    @HttpCode(204)
    @ApiOperation({ summary: 'Add phone number to current authenticated user' })
    addPhoneNumber(@Body() body: JSON): void {
        console.log(body);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Deletes phone number from current authenticated user' })
    deletePhoneNumber(@Param('id') id: string): void {
        console.log(id);
    }
}

export default PhoneController;
