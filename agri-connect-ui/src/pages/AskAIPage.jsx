import React, { useState } from 'react';
import { askAI } from '../services/api';
import { Link } from 'react-router-dom';

const AskAIPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    setError('');
    setAnswer('');
    const q = question.trim();
    if (!q) {
      setError('Please enter your question.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await askAI(q);
      setAnswer(data?.answer || 'No answer received.');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-800">Ask your queries to AI</h1>
          <Link to="/dashboard" className="text-green-700 hover:underline">← Back to Dashboard</Link>
        </div>

        <form onSubmit={handleAsk} className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your farming question here (e.g., pest control advice for cotton, fertilizer schedule for wheat, etc.)"
            className="w-full h-32 p-3 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded"
          >
            {loading ? 'Asking…' : 'Ask AI'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        {answer && (
          <div className="mt-4 p-4 border border-green-200 bg-green-50 text-green-800 rounded whitespace-pre-wrap">
            {answer}
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500">
          Note: AI answers may be inaccurate. Please verify critical decisions with an agricultural expert or local extension service.
        </p>
      </div>
    </div>
  );
};

export default AskAIPage;
