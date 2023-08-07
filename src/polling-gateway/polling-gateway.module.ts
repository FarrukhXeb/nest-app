import { Module } from '@nestjs/common';
import { PollingGateway } from './polling.gateway';
import { PollsService } from 'src/polls/polls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from 'src/polls/entities/poll.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, User, Role])],
  providers: [PollsService, UsersService, PollingGateway],
})
export class PollingGatewayModule {}
