import { CacheModule as CM } from '@nestjs/common';
import { MongooseModule as MM } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';
import globalSettings from '../config';

const MONGO_CONNECTION_STRING = `mongodb://${globalSettings.MONGODB_USER()}:${globalSettings.MONGODB_PASSWORD()}@${globalSettings.MONGODB_HOST()}:${globalSettings.MONGODB_PORT()}`;

const MongooseModule = MM.forRoot(MONGO_CONNECTION_STRING, {
    dbName: globalSettings.MONGODB_DATABASE(),
    authSource: 'admin',
    readPreference: 'primary',
    directConnection: true,
});

const CacheModule = CM.register({
    isGlobal: true,
    store: redisStore,
    host: globalSettings.REDIS_HOST(),
    port: globalSettings.REDIS_PORT(),
});

export { MongooseModule, CacheModule };
