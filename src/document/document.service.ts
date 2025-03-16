import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from 'src/llm/llm.service';
import { OcrService } from '../ocr/ocr.service';
import { Multer } from 'multer';

@Injectable()
export class DocumentService {
  constructor(
    private readonly ocrService: OcrService,
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}

  async processUploadedDocument(file: Multer.File) {
    const ocrText = await this.ocrService.extractTextFromImage(file.buffer);

    const summary = await this.llmService.explainInvoice(ocrText, 'Summarize this invoice');
    
    const document = await this.createDocument(file.originalname, ocrText, file.buffer, summary);

    return { text: ocrText, summary };
  }

  async createDocument(filename: string, text: string, image: Uint8Array, userId: string, summary?: string) {
    return this.prisma.document.create({
      data: {
        filename,
        text,
        image,
        summary,
        userId,
      },
    });
  }

  async getAllDocuments(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
    });
  }

  async getDocumentById(id: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, userId },
    });
    if (!document) {
      throw new Error(`Document with id ${id} not found for user ${userId}`);
    }
    return document;
  }

  async deleteDocument(id: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, userId },
    });
    if (!document) {
      throw new Error(`Document with id ${id} not found for user ${userId}`);
    }
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
