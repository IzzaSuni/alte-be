import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { login, UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './user.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: userSchema }])],
  providers: [UserService],
  controllers: [UserController, login],
})
export class UserModule {}
