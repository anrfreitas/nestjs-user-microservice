import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {
    @Prop({
        required: true,
        default: 'user-microservice',
    })
    service: string;

    @Prop({
        required: true,
    })
    context: string;

    @Prop({
        required: true,
        default: Date.now(),
    })
    datetime: Date;

    @Prop({
        required: true,
        unique: true,
        index: true,
    })
    external_id: string;

    @Prop({
        required: true,
    })
    data: string;

    @Prop({
        required: false,
    })
    model?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
