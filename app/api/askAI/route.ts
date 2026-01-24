import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Received request to /api/askAI'); // Debug log
  try {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt.substring(0, 50) + '...'); // Debug log
    
    // Get OpenRouter API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OpenRouter API key not configured in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'OpenRouter API key not configured' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Making request to OpenRouter API'); // Debug log
    
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // Using a reliable free model
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable assistant for a Philippine barangay (local community) information system. Provide helpful, accurate, and concise responses related to:
            - Barangay operations and procedures
            - Local governance processes
            - Community matters and events
            - Resident services and requirements
            - Document processing (clearances, permits, certificates)
            - Barangay policies and regulations
            - Community development programs
            Respond in a friendly, professional manner appropriate for local government service.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      // Try to parse error response, fallback to text if not JSON
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // If response is not JSON, get text instead
        const errorText = await response.text();
        errorData = { error: errorText };
      }
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenRouter response data:', data); // Debug log
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';

    return new Response(
      JSON.stringify({ 
        answer: aiResponse 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('AI API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get response from AI', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}