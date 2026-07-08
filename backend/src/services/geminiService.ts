import { GoogleGenerativeAI } from '@google/generative-ai';
import { CRM_MAPPING_SYSTEM_PROMPT } from '../prompts/crmMappingPrompt.js';
import { AiRowsPayload, AiResponsePayload } from '../types/ai.js';

const modelName = 'gemini-1.5-flash';
const requestTimeoutMs = 45000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Gemini request timed out.'));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

function extractJsonPayload(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

export async function mapRowsWithGemini(payload: AiRowsPayload): Promise<AiResponsePayload> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: modelName });

  const prompt = [
    CRM_MAPPING_SYSTEM_PROMPT,
    '',
    'Input rows JSON:',
    JSON.stringify(payload, null, 2),
    '',
    'Return JSON with a single records array matching the input rows order.',
  ].join('\n');

  const response = await withTimeout(
    model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
    requestTimeoutMs,
  );

  const text = response.response.text();
  const parsed = JSON.parse(extractJsonPayload(text)) as AiResponsePayload;

  if (!parsed || !Array.isArray(parsed.records)) {
    throw new Error('Gemini returned an invalid payload.');
  }

  return parsed;
}