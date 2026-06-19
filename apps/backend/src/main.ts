import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  // Configure global API routes prefix
  app.setGlobalPrefix("api");

  // Configure CORS mappings
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Wire up global request DTO parsing and validation controls
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Wire up global error filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`[Backend] NestJS gateway services running on: http://localhost:${port}/api`);
}

bootstrap();
