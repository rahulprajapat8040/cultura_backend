import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Modules from './modules';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [...Modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .exclude(
        "auth/signup",
        "auth/login",
        "auth/send-otp",
      )
      .forRoutes('*path')
  }
}
