import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PollsService } from './polls.service';

@Injectable()
export class PollGuard implements CanActivate {
  constructor(private readonly pollsService: PollsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const { id } = request.params;
    const canAccess = await this.pollsService.checkIsParticipantOrOwner(
      +id,
      user.id,
    );
    if (!canAccess) {
      return false;
    }
    return true;
  }
}
