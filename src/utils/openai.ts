import OpenAI from 'openai';
import { getAPIKey } from './config.js';

let openaiClient: OpenAI;

const initOpenAIClient = async () => {
    const API_KEY = await getAPIKey();

    openaiClient = new OpenAI({
        apiKey: API_KEY,
    });
};


export const generatePrompt = (
    locale: string,
    maxLength: number,
    emoji: boolean,
) => [
    'Generate a concise git commit message written in present tense for the following code diff with the given specifications below:',
    `Message language: ${locale}`,
    `Commit message must be a maximum of ${maxLength} characters${emoji ? ' and also include emoji at the starting' : ''}.`,
    'Exclude anything unnecessary such as translation. Your entire response will be passed directly into git commit.',
].filter(Boolean).join('\n');

const deduplicateMessages = (array: string[]) => Array.from(new Set(array));

const sanitizeMessage = (message: string) => message.trim().replace(/[\n\r]/g, '').replace(/(\w)\.$/, '$1');


export const generateCommitMessage = async (
    locale: string,
    diff: string,
    completions: number,
    maxLength: number,
    emoji: boolean,
) => {
    if (!openaiClient) {
        await initOpenAIClient();
    }


    try {

        const completion = await openaiClient.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: generatePrompt(locale, maxLength, emoji),
                },
                {
                    role: 'user',
                    content: diff,
                },
            ],
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 200,
            stream: false,
            n: completions,
        });

        return deduplicateMessages(
            completion.choices
                .filter(choice => choice.message?.content)
                .map(choice => sanitizeMessage(choice.message!.content)),
        );

    } catch (error) {
        const errorAsAny = error as any;

        if (errorAsAny.code === 'ENOTFOUND') {
            console.error(`Error connecting to ${errorAsAny.hostname} (${errorAsAny.syscall}). Are you connected to the internet?`);
        }

        throw errorAsAny;
    }

}