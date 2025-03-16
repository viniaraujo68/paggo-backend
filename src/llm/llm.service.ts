import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class LlmService {
  private hf: HfInference;
  private model = 'mistralai/Mistral-7B-Instruct-v0.3'; 

  constructor(private configService: ConfigService) {
    this.hf = new HfInference(this.configService.get<string>('HF_API_KEY'));
  }

  async explainInvoice(text: string, question: string): Promise<string> {
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
          max_new_tokens: 250,
          temperature: 0.3,
        },
      });

      const generatedText = response.generated_text.split('[/INST]')[1]?.trim();;

      return generatedText;
    } catch (error) {
      throw new Error(`LLM API Error: ${error.message}`);
    }
  }

  async answerQuestion(question: string, text: string): Promise<string> {

    const prompt = `
      [INST] You are a question-answering assistant. Analyze this text based on an invoice image and previous messages:
      "${text}"

      Answer this question: "${question}". 
      Focus on the most relevant information. Be concise.
      [/INST]
    `;

    try {
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 250, 
          temperature: 0.3,
        },
      });

      const generatedText = response.generated_text.split('[/INST]')[1]?.trim();;
      
      return generatedText;
    } catch (error) {
      throw new Error(`LLM API Error: ${error.message}`);
    }
  }
}
