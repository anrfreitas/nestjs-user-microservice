import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import AuthService from './auth.service';

@Module({
    exports: [AuthService],
    imports: [HttpModule],
    providers: [AuthService],
})
class AuthModule {}

export default AuthModule;
