"use client";

import { useState } from 'react';

const AdminAIPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const res = await fetch('/api/askAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) {
        console.error('API Response Status:', res.status);
        console.error('API Response Headers:', [...res.headers.entries()]);
        
        let errorData: { error?: string } = {};
        try {
          errorData = await res.json();
        } catch {
          const errorText = await res.text();
          console.error('Raw error response:', errorText);
          errorData = { error: errorText };
        }
        console.error('Parsed API Error:', errorData);
        setAnswer(`Error: Status ${res.status} - ${errorData.error || 'Failed to get response from AI'}`);
        return;
      }
      
      const data = await res.json();
      console.log('API Response:', data); // Debug log
      setAnswer(data.answer || 'No answer from AI.');
    } catch (error) {
      console.error('Frontend Error:', error);
      setAnswer('Error contacting AI. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Barangay AI Assistant</h1>
          <p className="text-gray-600 mb-6">Ask questions about residents, complaints, reports, and barangay operations</p>
          
          <div className="mb-6">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              id="question"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[150px]"
              placeholder="Ask anything about barangay operations, residents, documents, or community matters..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={handleAskAI}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Ask AI Assistant'
            )}
          </button>
        </div>

        {answer && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">AI Response</h2>
            </div>
            <div className="prose prose-blue max-w-none p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAIPage;