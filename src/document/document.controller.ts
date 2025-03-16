import { Body, Controller, Post, UploadedFile, UseInterceptors, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Multer.File,
  ): Promise<{ text: string; summary?: string }> {
    console.log('Received a file upload request');
    
    // Delegate text extraction and summary to the service
    const { text, summary } = await this.documentService.processUploadedDocument(file);

    return { text, summary };
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
