import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Login, UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './user.model';
import { TokenCheck } from './user.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: userSchema }])],
  providers: [UserService],
  controllers: [UserController, Login],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenCheck)
      .forRoutes({ path: 'user', method: RequestMethod.GET });
  }
}
