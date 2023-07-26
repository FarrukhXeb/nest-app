import { ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TypeormConfigService } from 'src/database/typeorm-config.service';
import { RolesModule } from 'src/roles/roles.module';
import { TodoModule } from 'src/todo/todo.module';
import { TokenModule } from 'src/token/token.module';
import { UsersModule } from 'src/users/users.module';
import { DataSource, DataSourceOptions } from 'typeorm';

export const createMiniApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      TypeOrmModule.forRootAsync({
        useClass: TypeormConfigService,
        dataSourceFactory: async (options: DataSourceOptions) => {
          return new DataSource(options).initialize();
        },
      }),
      TodoModule,
      AuthModule,
      UsersModule,
      TokenModule,
      RolesModule,
    ],
    providers: [ConfigService],
  }).compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  return app;
};
