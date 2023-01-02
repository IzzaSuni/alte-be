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
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass:
            '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',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
