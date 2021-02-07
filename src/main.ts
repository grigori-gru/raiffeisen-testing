import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            whitelist: true,
        }),
    );

    const options = new DocumentBuilder()
        .setTitle('PACS service')
        .setDescription('Backend service API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(3000);
}
bootstrap();
