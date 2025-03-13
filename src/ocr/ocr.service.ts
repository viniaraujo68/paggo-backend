import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
      return text;
    } catch (error) {
      console.error('Error attempting to read image:', error);
      throw new Error('Error attempting to read image.');
    }
  }
}