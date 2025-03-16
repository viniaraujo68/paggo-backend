import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from './llm/llm.module';
import { OcrService } from './ocr/ocr.service';
import { DocumentController } from './document/document.controller';
import { DocumentModule } from './document/document.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), LlmModule, DocumentModule, PrismaModule, MessageModule, AuthModule, UserModule],
  controllers: [AppController, DocumentController],
  providers: [AppService, OcrService, PrismaService, UserService],
})
export class AppModule {}
