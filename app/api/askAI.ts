import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': 'http://your-brgy-system.local', // optional
    'X-Title': 'Barangay Info System', // optional
  },
});

type Data = {
  answer?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openRouter.chat.send({
      model: 'openai/gpt-5.2',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant for the Barangay Information System. Help summarize residents, complaints, and reports.',
        },
        { role: 'user', content: prompt },
      ],
      stream: false,
    });

    const answer = completion.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI request failed' });
  }
}
