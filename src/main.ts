import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { RolesSeedService } from './roles/roles-seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  // Seeds
  await app.get<RolesSeedService>(RolesSeedService).run();
  await app.listen(3000);
}
bootstrap();
