import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Poll } from './entities/poll.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, User, Role]), QuestionsModule],
  providers: [PollsService, UsersService],
  controllers: [PollsController],
})
export class PollsModule {}
