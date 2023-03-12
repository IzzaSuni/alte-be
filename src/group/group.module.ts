import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { groupSchema } from './group.model';

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [
    MongooseModule.forFeature([{ name: 'Group', schema: groupSchema }]),
  ],
})
export class GroupModule {}
