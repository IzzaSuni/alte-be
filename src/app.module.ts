import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://soxiSpeed:Sunariadi180901!@alte.uypme2k.mongodb.net/ALTE?retryWrites=true&w=majority',
    ),
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: 'gmail',
        auth: {
          user: 'kmitera.cms@gmail.com',
          pass:
            'Sunariadi180901',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
