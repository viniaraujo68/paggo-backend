import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

      const { data: { text } } = await Tesseract.recognize(base64Image, 'eng');

      return text.trim();
    } catch (error) {
      console.error('Error attempting to read image:', error);
      throw new Error('Error attempting to read image.');
    }
  }
}
