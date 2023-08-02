import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';

@Injectable()
export class PollWithIdInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const id = parseInt(context.switchToHttp().getRequest().params.id);
    return next.handle().pipe(
      tap(async () => {
        const poll = await this.pollRepository.findOne({ where: { id } });
        if (!poll) {
          throw new NotFoundException(`Poll with id ${id} not found`);
        }
      }),
    );
  }
}
