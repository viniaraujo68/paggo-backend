import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class LlmService {
  private hf: HfInference;
  private model = 'mistralai/Mistral-7B-Instruct-v0.3'; 

  constructor(private configService: ConfigService) {
    // Initialize Hugging Face with API key
    this.hf = new HfInference(this.configService.get<string>('HF_API_KEY'));
  }

  async explainInvoice(text: string, question: string): Promise<string> {
    // Craft a structured prompt for DeepSeek-R1
    const prompt = `
      [INST] You are an invoice analysis assistant. Analyze this OCR text:
      "${text}"

      Answer this question: "${question}". 
      Focus on amounts, dates, vendor names, and totals. Be concise.
      [/INST]
    `;

    try {
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 250, // Control response length
          temperature: 0.3, // Reduce randomness
        },
      });

      return response.generated_text;
    } catch (error) {
      throw new Error(`LLM API Error: ${error.message}`);
    }
  }
}
