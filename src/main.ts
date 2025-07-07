import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv'
import * as cors from 'cors'
dotenv.config()
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({ origin: "*" }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
