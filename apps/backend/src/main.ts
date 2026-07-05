import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logger configuration
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;

  // Security & Middleware
  app.use(helmet());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(compression());
  app.use(cookieParser());

  // Global prefixes and versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('MangaNarrator AI Backend')
    .setDescription('The core API documentation for MangaNarrator AI')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}`);
}
bootstrap();
