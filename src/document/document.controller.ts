import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from '../ocr/ocr.service';
import { LlmService } from '../llm/llm.service';
import { Multer } from 'multer';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly llmService: LlmService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' matches the FormData field name
  async uploadDocument(
    @UploadedFile() file: Multer.File,
  ): Promise<{ text: string; summary?: string }> {
    console.log('Received a file upload request');

    // Step 1: Extract text via OCR
    const ocrText = await this.ocrService.extractTextFromImage(file.buffer);

    // Step 2: Optional - Generate a summary using the LLM
    const summary = await this.llmService.explainInvoice(ocrText, 'Summarize this invoice');

    return { text: ocrText, summary };
  }
}