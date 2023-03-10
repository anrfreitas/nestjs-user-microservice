const ENV = () => process.env.ENV ?? 'development';

// Microservice settings
const MICROSERVICE_APP_CONTEXT = () => process.env.MICROSERVICE_APP_CONTEXT || 'NESTJS_DEMO';
const MICROSERVICE_API_VERSION = () => process.env.MICROSERVICE_API_VERSION ?? '1.0.0';
const MICROSERVICE_GLOBAL_PREFIX = () => process.env.MICROSERVICE_GLOBAL_PREFIX ?? 'api/demo';
const MICROSERVICE_PORT = () => process.env.MICROSERVICE_PORT ?? 9999;
const MICROSERVICE_DEBUG = () => process.env.MICROSERVICE_DEBUG ?? false;

// Loading RabbitMQ settings
const RABBITMQ_HOST = () => process.env.RABBITMQ_HOST || 'zero_rabbitmq';
const RABBITMQ_PORT = () => process.env.RABBITMQ_PORT || '5672';
const RABBITMQ_USERNAME = () => process.env.RABBITMQ_USERNAME || 'zero';
const RABBITMQ_PASSWORD = () => process.env.RABBITMQ_PASSWORD || 'secret';
const RABBITMQ_PREFETCH_COUNT = () => process.env.RABBITMQ_PREFETCH_COUNT || 1;
const RABBITMQ_PERSIST_MESSAGE_NTIMES = () => process.env.RABBITMQ_PERSIST_MESSAGE_NTIMES || 2;
const RABBITMQ_DEFAULT_QUEUE = () => process.env.RABBITMQ_DEFAULT_QUEUE || 'NESTJS_DEMO_QUEUE';

// Global environment settings
const RABBITMQ_CLIENT_PROXY_TOKEN = () =>
    process.env.RABBITMQ_CLIENT_PROXY_TOKEN || 'RABBITMQ_CLIENT_PROXY_TOKEN';

// Crypto
const ENCRYPTION_KEY = () => process.env.ENCRYPTION_KEY || 'byz9VFNtbRQM0yBODcCb1lrUtVVH3D3x';
const ENCRYPTION_IV = () => process.env.ENCRYPTION_IV || 'X05IGQ5qdBnIqAWD';

// Mongo
const MONGODB_USER = () => process.env.MONGODB_USER || 'zero';
const MONGODB_PASSWORD = () => process.env.MONGODB_PASSWORD || 'secret';
const MONGODB_HOST = () => process.env.MONGODB_HOST || 'zero_mongo';
const MONGODB_PORT = () => process.env.MONGODB_PORT || '27017';
const MONGODB_DATABASE = () => process.env.MONGODB_DATABASE || 'logs';

// Redis
const REDIS_HOST = () => process.env.REDIS_HOST || 'zero_redis';
const REDIS_PORT = () => process.env.REDIS_PORT || '6379';

const globalSettings = {
    ENV,
    MICROSERVICE_APP_CONTEXT,
    MICROSERVICE_API_VERSION,
    MICROSERVICE_GLOBAL_PREFIX,
    MICROSERVICE_PORT,
    MICROSERVICE_DEBUG,
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_USERNAME,
    RABBITMQ_PASSWORD,
    RABBITMQ_PREFETCH_COUNT,
    RABBITMQ_PERSIST_MESSAGE_NTIMES,
    RABBITMQ_CLIENT_PROXY_TOKEN,
    RABBITMQ_DEFAULT_QUEUE,
    ENCRYPTION_KEY,
    ENCRYPTION_IV,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_PORT,
    MONGODB_DATABASE,
    REDIS_HOST,
    REDIS_PORT,
};

export default globalSettings;
