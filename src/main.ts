import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JsonApiInterceptor } from './interceptors/TransformInterceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new JsonApiInterceptor());

  // 👇 agrega esta línea para activar validaciones globales
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

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
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app:', err);
});
