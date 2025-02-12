import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')
  app.enableCors()

  const prismaService = app.get(PrismaService)   
  // await prismaService.enableShutdownHooks(app)
  
  await app.listen(4200);
}
bootstrap();
