import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Poll } from './entities/poll.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { ResponsesModule } from './responses/responses.module';
import { PollGuard } from './polls.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll, User, Role]),
    QuestionsModule,
    OptionsModule,
    ResponsesModule,
  ],
  providers: [PollsService, UsersService, PollGuard],
  controllers: [PollsController],
})
export class PollsModule {}
