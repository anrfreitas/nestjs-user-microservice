import { Test, TestingModule } from '@nestjs/testing';
import globalSettings from '../../config';
import MainController from './main.controller';
import MainModule from './main.module';

describe('Main Controller', () => {
    let main: TestingModule;
    let mainController: MainController;

    beforeAll(async () => {
        main = await Test.createTestingModule({
            imports: [MainModule],
        }).compile();
    });

    describe('Welcome', () => {
        it('should return the Welcome Message', () => {
            mainController = main.get<MainController>(MainController);
            expect(mainController.getWelcome()).toBe(globalSettings.MICROSERVICE_APP_CONTEXT());
        });
    });
});
