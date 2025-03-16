import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('create/:documentId')
  async create(
    @Param('documentId') documentId: string,
    @Body() body: { content: string; order: number }
  ) {
    const { content, order } = body;

    // Delegate the LLM logic and message creation to the service
    const message = await this.messageService.createMessageWithLLM(content, order, documentId);

    return message;
  }

  @Get(':documentId')
  findAllByDocumentId(@Param('documentId') documentId: string) {
    return this.messageService.findAllByDocumentId(documentId);
  }
}
