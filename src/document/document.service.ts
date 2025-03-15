import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(filename: string, text: string, image: Uint8Array, summary?: string) {
    return this.prisma.document.create({
      data: {
        filename,
        text,
        image,
        summary,
      }
    });
  }
  async getAllDocuments() {
    return this.prisma.document.findMany();
  }

  async getDocumentById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: id },
    });
    if (!document) {
      throw new Error(`Document with id ${id} not found`);
    }
    return document;
  }
}