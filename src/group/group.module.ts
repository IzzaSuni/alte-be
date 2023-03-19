import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { groupSchema } from './group.model';
import { PraktikumSchema } from 'src/praktikum/praktikum.model';
import { userSchema } from 'src/user/user.model';

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [
    MongooseModule.forFeature([
      { name: 'group', schema: groupSchema },
      { name: 'praktikum', schema: PraktikumSchema },
      { name: 'user', schema: userSchema },
    ]),
  ],
})
export class GroupModule {}
