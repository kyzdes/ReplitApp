import { AIService } from './base';
import { AIServiceFactory } from './factory';
import { AIProviderName } from '@ai-dev-platform/shared';

export interface EnhancedAIFeatures {
  explainCode(code: string, language: string): Promise<string>;
  debugCode(code: string, error: string, language: string): Promise<string>;
  refactorCode(code: string, language: string, instruction: string): Promise<string>;
  generateTests(code: string, language: string): Promise<string>;
  improveCode(code: string, language: string): Promise<{ code: string; improvements: string[] }>;
  convertLanguage(code: string, fromLang: string, toLang: string): Promise<string>;
}

export class EnhancedAIService implements EnhancedAIFeatures {
  private service: AIService;

  constructor(provider: AIProviderName) {
    this.service = AIServiceFactory.getService(provider);
  }

  async explainCode(code: string, language: string): Promise<string> {
    const prompt = `Explain the following ${language} code in detail. Be clear and concise:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. What the code does
2. How it works
3. Any potential issues or improvements`;

    const messages = [
      { role: 'system', content: 'You are an expert code reviewer and teacher.' },
      { role: 'user', content: prompt },
    ];

    return await this.service.chat(messages);
  }

  async debugCode(code: string, error: string, language: string): Promise<string> {
    const prompt = `Debug this ${language} code. The error is: "${error}"

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Explanation of the error
2. Root cause
3. Fixed code
4. Prevention tips`;

    const messages = [
      { role: 'system', content: 'You are an expert debugger.' },
      { role: 'user', content: prompt },
    ];

    return await this.service.chat(messages);
  }

  async refactorCode(code: string, language: string, instruction: string): Promise<string> {
    const prompt = `Refactor this ${language} code: ${instruction}

\`\`\`${language}
${code}
\`\`\`

Return only the refactored code.`;

    const response = await this.service.generate({
      provider: 'anthropic' as AIProviderName,
      prompt,
      context: { language },
    });

    return response.code;
  }

  async generateTests(code: string, language: string): Promise<string> {
    const testFramework = language === 'typescript' || language === 'javascript'
      ? 'Vitest'
      : language === 'python'
      ? 'pytest'
      : 'appropriate test framework';

    const prompt = `Generate comprehensive unit tests for this ${language} code using ${testFramework}:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Happy path tests
2. Edge cases
3. Error cases`;

    const response = await this.service.generate({
      provider: 'anthropic' as AIProviderName,
      prompt,
      context: { language },
    });

    return response.code;
  }

  async improveCode(
    code: string,
    language: string
  ): Promise<{ code: string; improvements: string[] }> {
    const prompt = `Improve this ${language} code for:
- Performance
- Readability
- Best practices
- Security

Original code:
\`\`\`${language}
${code}
\`\`\`

Return improved code and list of improvements made.`;

    const messages = [
      { role: 'system', content: 'You are an expert code optimizer.' },
      { role: 'user', content: prompt },
    ];

    const response = await this.service.chat(messages);

    // Parse response to extract code and improvements
    const codeMatch = response.match(/```[\w]*\n([\s\S]*?)\n```/);
    const improvedCode = codeMatch ? codeMatch[1] : code;

    const improvementsList = response
      .split('\n')
      .filter(line => line.match(/^[-*]\s+/))
      .map(line => line.replace(/^[-*]\s+/, '').trim());

    return {
      code: improvedCode,
      improvements: improvementsList,
    };
  }

  async convertLanguage(code: string, fromLang: string, toLang: string): Promise<string> {
    const prompt = `Convert this ${fromLang} code to ${toLang}:

\`\`\`${fromLang}
${code}
\`\`\`

Maintain the same functionality. Return only the converted code.`;

    const response = await this.service.generate({
      provider: 'anthropic' as AIProviderName,
      prompt,
      context: { language: toLang },
    });

    return response.code;
  }
}
