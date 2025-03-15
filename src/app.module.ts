import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from './llm/llm.module';
import { OcrService } from './ocr/ocr.service';
import { DocumentController } from './document/document.controller';
import { DocumentModule } from './document/document.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [ConfigModule.forRoot(), LlmModule, DocumentModule, PrismaModule, MessageModule],
  controllers: [AppController, DocumentController],
  providers: [AppService, OcrService, PrismaService],
})
export class AppModule {}
