import OpenAI from 'openai';
import { AIGenerateRequest, AIGenerateResponse, AIStreamChunk } from '@ai-dev-platform/shared';
import { BaseAIService } from './base';

export class OpenAIService extends BaseAIService {
  private client: OpenAI;

  constructor(apiKey: string, defaultModel: string = 'gpt-4-turbo-preview') {
    super(apiKey, undefined, defaultModel);

    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({ apiKey });
  }

  async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    const prompt = this.buildPrompt(request);

    const completion = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages: [
        {
          role: 'system',
          content: 'You are an expert programmer. Generate clean, efficient, and well-documented code based on user requirements. Only output the code without additional explanations unless asked.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: request.options?.temperature ?? 0.7,
      max_tokens: request.options?.maxTokens ?? 2048,
    });

    const code = completion.choices[0]?.message?.content || '';
    const language = request.context?.language || this.detectLanguage(code);

    return {
      code,
      language,
      tokensUsed: completion.usage?.total_tokens,
      model: completion.model,
    };
  }

  async stream(
    request: AIGenerateRequest,
    onChunk: (chunk: AIStreamChunk) => void
  ): Promise<void> {
    const prompt = this.buildPrompt(request);

    const stream = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages: [
        {
          role: 'system',
          content: 'You are an expert programmer. Generate clean, efficient, and well-documented code.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: request.options?.temperature ?? 0.7,
      max_tokens: request.options?.maxTokens ?? 2048,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      const finished = chunk.choices[0]?.finish_reason !== null;

      onChunk({ delta, finished });

      if (finished) break;
    }
  }

  async chat(
    messages: Array<{ role: string; content: string }>,
    options?: any
  ): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages: messages as any,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    });

    return completion.choices[0]?.message?.content || '';
  }
}
