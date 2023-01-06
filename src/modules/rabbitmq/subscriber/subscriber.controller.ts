import { Controller, Logger } from '@nestjs/common';
import { EventPattern, RmqContext, Ctx, Payload } from '@nestjs/microservices';

/* Important
 * You must implement every event pattern,
 * otherwise there's a chance server get stuck on invalid event pattern receival */
import rabbitEventPatterns from '../eventPatterns';

@Controller()
export default class SubscriberRabbitController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    @EventPattern(rabbitEventPatterns.testing)
    async subscribeTest(@Payload() data: unknown, @Ctx() context: RmqContext): Promise<void> {
        const channel = context.getChannelRef();
        const message = context.getMessage();
        Logger.log(`RabbitMQ [${rabbitEventPatterns.testing}] event pattern output: ${data}`);
        channel.ack(message);
    }
}
