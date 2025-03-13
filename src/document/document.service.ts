import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async createDocument(text: string, summary?: string) {
    return this.prisma.document.create({ 
      data: { text, summary },
    });
  }

  async getAllDocuments() {
    return this.prisma.document.findMany(); 
  }
}