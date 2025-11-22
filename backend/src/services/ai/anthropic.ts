import Anthropic from '@anthropic-ai/sdk';
import { AIGenerateRequest, AIGenerateResponse, AIStreamChunk } from '@ai-dev-platform/shared';
import { BaseAIService } from './base';

export class AnthropicService extends BaseAIService {
  private client: Anthropic;

  constructor(apiKey: string, defaultModel: string = 'claude-3-5-sonnet-20241022') {
    super(apiKey, undefined, defaultModel);

    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.client = new Anthropic({ apiKey });
  }

  async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    const prompt = this.buildPrompt(request);

    const message = await this.client.messages.create({
      model: this.defaultModel,
      max_tokens: request.options?.maxTokens ?? 4096,
      temperature: request.options?.temperature ?? 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      system: 'You are an expert programmer. Generate clean, efficient, and well-documented code based on user requirements. Only output the code without additional explanations unless asked.',
    });

    const code = message.content[0].type === 'text' ? message.content[0].text : '';
    const language = request.context?.language || this.detectLanguage(code);

    return {
      code,
      language,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
      model: message.model,
    };
  }

  async stream(
    request: AIGenerateRequest,
    onChunk: (chunk: AIStreamChunk) => void
  ): Promise<void> {
    const prompt = this.buildPrompt(request);

    const stream = await this.client.messages.create({
      model: this.defaultModel,
      max_tokens: request.options?.maxTokens ?? 4096,
      temperature: request.options?.temperature ?? 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      system: 'You are an expert programmer. Generate clean, efficient, and well-documented code.',
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        onChunk({
          delta: event.delta.text,
          finished: false,
        });
      } else if (event.type === 'message_stop') {
        onChunk({
          delta: '',
          finished: true,
        });
      }
    }
  }

  async chat(
    messages: Array<{ role: string; content: string }>,
    options?: any
  ): Promise<string> {
    const formattedMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const systemMessage = messages.find(m => m.role === 'system')?.content;

    const message = await this.client.messages.create({
      model: this.defaultModel,
      max_tokens: options?.maxTokens ?? 2048,
      temperature: options?.temperature ?? 0.7,
      messages: formattedMessages,
      system: systemMessage,
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }
}
