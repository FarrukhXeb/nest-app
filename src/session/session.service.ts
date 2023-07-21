import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async findOne(where: FindOptionsWhere<Session>): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where,
    });
  }

  async findMany(where: FindOptionsWhere<Session>): Promise<Session[]> {
    return this.sessionRepository.find({
      where,
    });
  }

  async create(data: DeepPartial<Session>): Promise<Session> {
    return this.sessionRepository.save(this.sessionRepository.create(data));
  }

  async softDelete(id): Promise<void> {
    await this.sessionRepository.softDelete({
      id,
    });
  }
}
