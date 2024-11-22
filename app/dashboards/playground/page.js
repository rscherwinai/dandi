'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo(null);
    
    try {
      console.log('Submitting API key:', apiKey);
      
      const response = await fetch('/api/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response was not JSON");
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      setDebugInfo(data);

      if (response.ok) {
        toast.success('Valid API key, protected can be accessed');
      } else {
        switch (response.status) {
          case 400:
            toast.error(data.message || 'API key is required');
            break;
          case 401:
            toast.error(data.message || 'Invalid API key');
            break;
          case 403:
            toast.error(data.message || 'API key is inactive');
            break;
          case 500:
            toast.error(data.message || 'Server error');
            break;
          default:
            toast.error(data.message || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Request error:', error);
      toast.error(error.message || 'Network error occurred');
      setDebugInfo({
        error: error.message,
        stack: error.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">API Playground</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="Enter your API key"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white 
            ${isLoading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'} 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          {isLoading ? 'Validating...' : 'Validate Key'}
        </button>
      </form>

      {debugInfo && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-sm font-semibold mb-2">Debug Information:</h2>
          <pre className="text-xs overflow-auto whitespace-pre-wrap">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {apiKey && (
        <div className="mt-4 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Current API Key: {apiKey}</p>
        </div>
      )}
    </div>
  );
} 