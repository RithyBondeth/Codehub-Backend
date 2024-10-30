import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );
  app.enableCors({
    allowedHeaders: ['Content-Type'],
    //origin: `${process.env.ORIGIN_URL}` || "https://codehub-backend-hb3t.onrender.com", // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to allow cookies
  })
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();