import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import InitSwagger from './bootstrap/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  InitSwagger(app);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
