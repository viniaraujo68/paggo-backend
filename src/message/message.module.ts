import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { LlmService } from 'src/llm/llm.service';
import { DocumentService } from 'src/document/document.service';
import { ConfigModule } from '@nestjs/config';
import { OcrService } from 'src/ocr/ocr.service';

@Module({
  imports: [ConfigModule],
  controllers: [MessageController],
  providers: [MessageService, LlmService, DocumentService, OcrService],
})
export class MessageModule {}
