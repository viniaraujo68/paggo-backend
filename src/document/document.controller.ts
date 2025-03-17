import { Body, Controller, Post, UploadedFile, UseInterceptors, Get, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Multer.File,
    @Request() req,
  ): Promise<{ text: string; summary?: string }> {
    const { text, summary } = await this.documentService.processUploadedDocument(file, req.user.userId);

    return { text, summary };
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllDocuments(@Request() req,) {
    const documents = await this.documentService.getAllDocuments(req.user.userId);
    return documents.map(doc => ({
      id: doc.id,
      imageUrl: `data:image/jpeg;base64,${Buffer.from(doc.image).toString('base64')}`,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDocumentById(@Param('id') id: string, @Request() req) {
    return this.documentService.getDocumentById(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deleteDocument(@Param('id') id: string, @Request() req) {
    return this.documentService.deleteDocument(id, req.user.userId);
  }
}
