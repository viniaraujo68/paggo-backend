// src/document/document.module.ts
import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OcrService } from '../ocr/ocr.service';
import { LlmService } from '../llm/llm.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LlmModule } from 'src/llm/llm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, LlmModule, ConfigModule],
  controllers: [DocumentController],
  providers: [DocumentService, PrismaService, OcrService, LlmService],
  exports: [DocumentService],
})
export class DocumentModule {}