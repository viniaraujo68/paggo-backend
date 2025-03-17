import { Body, Controller, Post } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('llm')
export class LlmController {
	constructor(private readonly llmService: LlmService) {}

	@Post('explain')
	async explainInvoice(
		@Body() body: { text: string; question: string },
	): Promise<{ explanation: string }> {
		const explanation = await this.llmService.explainInvoice(
			body.text,
			body.question,
		);
		return { explanation };
	}
}