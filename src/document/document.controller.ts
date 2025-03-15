import { Body, Controller, Post, UploadedFile, UseInterceptors, Get, Param} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from '../ocr/ocr.service';
import { LlmService } from '../llm/llm.service';
import { Multer } from 'multer';
import { DocumentService } from './document.service';


@Controller('document')
export class DocumentController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly llmService: LlmService,
    private readonly documentService: DocumentService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Multer.File,
  ): Promise<{ text: string; summary?: string }> {
    console.log('Received a file upload request');

    // Step 1: Extract text via OCR
    const ocrText = await this.ocrService.extractTextFromImage(file.buffer);
    
    const fullSummary = await this.llmService.explainInvoice(ocrText, 'Summarize this invoice');

    const summary = fullSummary.split('[/INST]')[1]?.trim();

    const document = await this.documentService.createDocument(
      file.originalname,
      ocrText,
      file.buffer,
      summary,
    );

    return { text: ocrText, summary };
  }

  @Get('all')
  async getAllDocuments() {
    const documents = await this.documentService.getAllDocuments();
    return documents.map(doc => ({
      id: doc.id,
      imageUrl: `data:image/jpeg;base64,${Buffer.from(doc.image).toString('base64')}`,
    }));
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: string) {
    return this.documentService.getDocumentById(id);
  }

}