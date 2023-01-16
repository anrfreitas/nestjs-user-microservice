import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {
    @Prop()
    service: string;

    @Prop()
    context: string;

    @Prop()
    datetime: Date;

    @Prop()
    data: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
