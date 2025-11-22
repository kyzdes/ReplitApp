import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config';

export interface ScreenshotToCodeRequest {
  imageUrl?: string;
  imageBase64?: string;
  framework?: 'react' | 'vue' | 'html';
  style?: 'tailwind' | 'css' | 'styled-components';
}

export interface ScreenshotToCodeResponse {
  code: string;
  components: string[];
  explanation: string;
}

export class AIVisionService {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    if (config.ai.openai.apiKey) {
      this.openai = new OpenAI({ apiKey: config.ai.openai.apiKey });
    }
    if (config.ai.anthropic.apiKey) {
      this.anthropic = new Anthropic({ apiKey: config.ai.anthropic.apiKey });
    }
  }

  async screenshotToCode(request: ScreenshotToCodeRequest): Promise<ScreenshotToCodeResponse> {
    const framework = request.framework || 'react';
    const style = request.style || 'tailwind';

    // Use Claude (Anthropic) for vision if available, otherwise OpenAI
    if (this.anthropic && config.ai.anthropic.apiKey) {
      return this.claudeVision(request, framework, style);
    } else if (this.openai && config.ai.openai.apiKey) {
      return this.openaiVision(request, framework, style);
    }

    throw new Error('No AI vision provider configured');
  }

  private async claudeVision(
    request: ScreenshotToCodeRequest,
    framework: string,
    style: string
  ): Promise<ScreenshotToCodeResponse> {
    const prompt = `Analyze this UI screenshot and generate ${framework} code with ${style} styling.

Requirements:
1. Create clean, production-ready code
2. Use modern best practices
3. Make it responsive
4. Include all visible components
5. Add proper accessibility attributes
6. Use semantic HTML

Return:
1. Complete component code
2. List of components created
3. Brief explanation of the structure`;

    let imageSource;
    if (request.imageBase64) {
      imageSource = {
        type: 'base64' as const,
        media_type: 'image/png' as const,
        data: request.imageBase64,
      };
    } else if (request.imageUrl) {
      imageSource = {
        type: 'url' as const,
        url: request.imageUrl,
      };
    } else {
      throw new Error('No image provided');
    }

    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: imageSource,
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the response
    const codeMatch = response.match(/```[\w]*\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1] : response;

    // Extract components list
    const componentsMatch = response.match(/Components?:\s*\n([\s\S]*?)(?:\n\n|$)/i);
    const components = componentsMatch
      ? componentsMatch[1].split('\n').filter(l => l.trim()).map(l => l.replace(/^[-*]\s*/, ''))
      : [];

    // Extract explanation
    const explanationMatch = response.match(/Explanation:\s*\n([\s\S]*?)(?:```|$)/i);
    const explanation = explanationMatch ? explanationMatch[1].trim() : 'Code generated from screenshot';

    return {
      code,
      components,
      explanation,
    };
  }

  private async openaiVision(
    request: ScreenshotToCodeRequest,
    framework: string,
    style: string
  ): Promise<ScreenshotToCodeResponse> {
    const prompt = `Analyze this UI screenshot and generate ${framework} code with ${style} styling.

Create clean, production-ready code that matches the design exactly.
Use modern best practices and make it responsive.
Return only the code without explanations.`;

    const imageUrl = request.imageUrl || `data:image/png;base64,${request.imageBase64}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    const code = response.choices[0]?.message?.content || '';

    return {
      code,
      components: ['Generated Component'],
      explanation: 'Code generated from screenshot using GPT-4 Vision',
    };
  }
}
