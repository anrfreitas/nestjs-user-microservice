import { Injectable } from '@nestjs/common';
import globalSettings from '../../config';

@Injectable()
class MainService {
    getWelcome(): string {
        return globalSettings.MICROSERVICE_APP_CONTEXT();
    }
}

export default MainService;
