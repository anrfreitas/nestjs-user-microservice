import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './log.schema';

/**
 * @todo add here any other schema you create :)
 */
const Schemas = [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])];

export default Schemas;
