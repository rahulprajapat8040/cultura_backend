import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Modules from './modules';
import { AuthMiddleWare } from './middleware/auth.middleware';
import { excludeRoutes } from './utils/common/excludedRoutes';

@Module({
  imports: Modules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).exclude(...excludeRoutes).forRoutes("*path")
  }
}
