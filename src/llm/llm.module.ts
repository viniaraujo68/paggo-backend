import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Access environment variables
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}