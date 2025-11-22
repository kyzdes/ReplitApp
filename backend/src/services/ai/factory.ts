import { AIProviderName } from '@ai-dev-platform/shared';
import { config } from '../../config';
import { AIService } from './base';
import { OpenAIService } from './openai';
import { AnthropicService } from './anthropic';

export class AIServiceFactory {
  private static services = new Map<AIProviderName, AIService>();

  static getService(provider: AIProviderName): AIService {
    // Check cache first
    if (this.services.has(provider)) {
      return this.services.get(provider)!;
    }

    // Create new service
    let service: AIService;

    switch (provider) {
      case 'openai':
        if (!config.ai.openai.apiKey) {
          throw new Error('OpenAI API key not configured');
        }
        service = new OpenAIService(
          config.ai.openai.apiKey,
          config.ai.openai.defaultModel
        );
        break;

      case 'anthropic':
        if (!config.ai.anthropic.apiKey) {
          throw new Error('Anthropic API key not configured');
        }
        service = new AnthropicService(
          config.ai.anthropic.apiKey,
          config.ai.anthropic.defaultModel
        );
        break;

      case 'google':
        throw new Error('Google AI service not yet implemented');

      case 'mistral':
        throw new Error('Mistral AI service not yet implemented');

      case 'ollama':
        throw new Error('Ollama service not yet implemented');

      case 'custom':
        throw new Error('Custom AI provider not configured');

      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }

    // Cache the service
    this.services.set(provider, service);
    return service;
  }

  static getAvailableProviders(): AIProviderName[] {
    const providers: AIProviderName[] = [];

    if (config.ai.openai.apiKey) providers.push('openai');
    if (config.ai.anthropic.apiKey) providers.push('anthropic');
    if (config.ai.google.apiKey) providers.push('google');
    if (config.ai.mistral.apiKey) providers.push('mistral');
    if (config.ai.ollama.baseUrl) providers.push('ollama');

    return providers;
  }
}
