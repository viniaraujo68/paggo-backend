import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { DocumentService } from '../document/document.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService, 
    private readonly DocumentService: DocumentService,
  ) {}

  async createMessageWithLLM(content: string, order: number, documentId: string) {
    const document = await this.DocumentService.getDocumentById(documentId);
    const messages = await this.findAllByDocumentId(documentId);

    const context = document.summary + '\n' + messages.map(message => {
      const prefix = message.order % 2 === 0 ? "ANSWER: " : "QUESTION: ";
      return prefix + message.content;
    }).join(' ');

    console.log('Context:', context);

    const llmResponse = await this.llmService.answerQuestion(content, context);

    const llmMessage = await this.prisma.message.create({
      data: {
        content: llmResponse,
        order: order + 1,
        documentId: documentId,
      },
    });

    const userMessage = await this.prisma.message.create({
      data: {
        content,
        order,
        documentId,
      },
    });

    return { llmMessage, userMessage };
  }

  async findAllByDocumentId(documentId: string) {
    return this.prisma.message.findMany({
      where: { documentId },
      orderBy: { order: 'asc' },
    });
  }
}
