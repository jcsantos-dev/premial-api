import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');

  // 🔹 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('API de catálogo con NestJS y TypeORM')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🔹 Swagger en api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app:', err);
});
