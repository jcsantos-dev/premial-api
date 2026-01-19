import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JsonApiInterceptor } from './interceptors/TransformInterceptor';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  // 🔹 Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new JsonApiInterceptor());
  app.use(cookieParser());

  // 👇 agrega esta línea para activar validaciones globales
  // ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas
    transform: true, // Transforma tipos automáticamente
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: false, // Mantener mensajes de error para debug
    exceptionFactory: (errors) => {
      logger.error('Validation errors:', errors);
      return new BadRequestException(errors);
    },
  }));

  // 🔹 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('API de catálogo con NestJS y TypeORM')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🔹 Swagger en api/docs
  SwaggerModule.setup('api/docs', app, document);

  // Permitir solicitudes desde localhost:4200
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://premial-bussiness-web.vercel.app',
      'http://localhost:4300'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app:', err);
});
