import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true, // Sirve para que usuarios no me manden informacion que no estoy pidiendo, lo comentamos ya que nos da un error y en realidad GRAPHQL ya nos hace esta validacion asi que no importa
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
