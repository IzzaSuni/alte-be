import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JadwalModule } from './jadwal/jadwal.module';
 
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://soxiSpeed:Sunariadi180901!@alte.uypme2k.mongodb.net/ALTE?retryWrites=true&w=majority',
    ),
    UserModule,
    JadwalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
