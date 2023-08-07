import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeormConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { RolesModule } from './roles/roles.module';
import { PollsModule } from './polls/polls.module';
import { PollingGatewayModule } from './polling-gateway/polling-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    TokenModule,
    RolesModule,
    PollsModule,
    PollingGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
