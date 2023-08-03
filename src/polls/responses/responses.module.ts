import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { Response } from '../entities/response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from '../entities/poll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Response, Poll])],
  providers: [ResponsesService],
  exports: [ResponsesService],
})
export class ResponsesModule {}
