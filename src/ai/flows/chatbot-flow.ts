'use server';

/**
 * @fileOverview A simple chatbot flow that replies to user messages.
 *
 * - chatbot - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import wav from 'wav';

const ChatbotInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
  enableAudio: z.boolean().optional().describe('Whether to generate audio for the reply.'),
  language: z.string().optional().describe('The language to reply in (e.g., "en", "es").'),
  personality: z.string().optional().describe('The personality for the AI to adopt (e.g., "friendly", "teacher").'),
  responseStyle: z.string().optional().describe('The desired length and detail of the response (e.g., "simple", "detailed").'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  reply: z.string().describe("The AI's reply to the user message."),
  audio: z.string().optional().describe('A base64 encoded WAV audio data URI of the reply.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: z.object({ reply: z.string() })},
  prompt: `You are a smart chatbot with customizable settings. Always adapt your tone, language, and response style based on the user’s chosen preferences.

- Personality: {{{personality}}}
  - If 'teacher', explain concepts slowly and step-by-step.
  - If 'friendly', use emojis and a light, cheerful tone.
  - If 'coder', keep explanations concise, structured, and technical.
  - If 'creative', be imaginative and expressive.
  - If 'calm', provide short, peaceful, and simple replies.

- Language: Reply only in the language code provided (e.g., 'en' for English, 'es' for Spanish): {{{language}}}
- Response Style: Adjust the length and detail of your answer: {{{responseStyle}}}
  - If 'simple', provide a 1-2 line response.
  - If 'normal', provide a 3-5 line response.
  - If 'detailed', explain everything clearly and comprehensively.

User's message: {{{userMessage}}}

Your reply:`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output: textOutput} = await prompt(input);
    const reply = textOutput!.reply;

    if (!input.enableAudio) {
      return { reply };
    }

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: reply,
    });

    if (!media) {
      return { reply };
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);
    const audioDataUri = `data:audio/wav;base64,${wavBase64}`;
    
    return {
      reply,
      audio: audioDataUri,
    };
  }
);
