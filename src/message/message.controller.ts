import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/:documentId')
  async create(
    @Param('documentId') documentId: string,
    @Request() req,
    @Body() body: { content: string; order: number }
  ) {
    const { content, order } = body;

    const message = await this.messageService.createMessageWithLLM(content, order, documentId, req.user.userId);

    return message;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':documentId')
  findAllByDocumentId(@Param('documentId') documentId: string) {
    return this.messageService.findAllByDocumentId(documentId);
  }
}
