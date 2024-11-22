'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ApiKeyDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    keyId: null,
    keyName: ''
  });
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/keys');
      const data = await response.json();
      setApiKeys(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch API keys');
      setIsLoading(false);
    }
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Submitting new key:', newKeyName);
      
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create key');
      }
      
      const newKey = await response.json();
      console.log('New key created:', newKey);
      
      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating key:', err);
      setError('Failed to create API key: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateDelete = (keyId, keyName) => {
    setDeleteConfirmation({
      show: true,
      keyId,
      keyName
    });
  };

  const confirmDelete = async () => {
    try {
      await fetch(`/api/keys/${deleteConfirmation.keyId}`, {
        method: 'DELETE',
      });
      setApiKeys(apiKeys.filter(key => key.id !== deleteConfirmation.keyId));
      setDeleteConfirmation({ show: false, keyId: null, keyName: '' });
    } catch (err) {
      setError('Failed to delete API key');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, keyId: null, keyName: '' });
  };

  const startEditing = (key) => {
    setEditingKey(key.id);
    setEditName(key.name);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditName('');
  };

  const updateApiKey = async (keyId) => {
    try {
      console.log('Starting update for key:', keyId);
      
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update key');
      }

      const updatedKey = await response.json();
      
      // Update the local state
      setApiKeys(prevKeys => 
        prevKeys.map(key => 
          key.id === keyId ? { ...key, name: editName } : key
        )
      );
      
      // Reset edit state
      setEditingKey(null);
      setEditName('');
      
      console.log('Successfully updated key:', keyId);

    } catch (error) {
      console.error('Error updating key:', error);
      setError(error.message);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
        setTimeout(() => {
          setVisibleKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(keyId);
            return newSet;
          });
        }, 30000);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally add a toast notification here
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleEditSubmit = async (e, keyId) => {
    e.preventDefault();
    await updateApiKey(keyId);
  };

  return (
    <div>
      {/* Animated Gradient Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-400 text-white"
      >
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="text-sm mb-2">CURRENT PLAN</div>
              <h1 className="text-4xl font-bold">Researcher</h1>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
            >
              Manage Plan
            </motion.button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span>API Limit</span>
              <span className="cursor-help hover:opacity-80 transition-opacity">ⓘ</span>
            </div>
            <div className="bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '25%' }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                className="bg-white rounded-full h-2"
              />
            </div>
            <div className="text-sm">24/1,000 Requests</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated Content Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-6"
      >
        {/* API Keys Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">API Keys</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-[#1a75ff] text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                + New Key
              </button>
            </div>
          </div>

          {/* Create Key Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <form onSubmit={createApiKey} className="flex gap-4">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter API key name"
                  className="flex-1 p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a75ff] text-white rounded hover:bg-blue-600"
                >
                  Create Key
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiKeys && apiKeys.map((apiKey, index) => (
                  <tr key={`row-${apiKey.id || index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingKey === apiKey.id ? (
                        <form key={`form-${apiKey.id}`} onSubmit={(e) => handleEditSubmit(e, apiKey.id)}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border rounded px-2 py-1"
                            autoFocus
                            onBlur={() => updateApiKey(apiKey.id)}
                          />
                        </form>
                      ) : (
                        <span key={`name-${apiKey.id}`}>{apiKey.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <span key={`usage-${apiKey.id}`}>{apiKey.usage || '0'} requests</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      <span key={`key-${apiKey.id}`}>
                        {visibleKeys.has(apiKey.id) ? apiKey.key : '••••••••••••••••'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div key={`actions-${apiKey.id}`} className="flex gap-2">
                        <button
                          key={`visibility-${apiKey.id}`}
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {visibleKeys.has(apiKey.id) ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button
                          key={`edit-${apiKey.id}`}
                          onClick={() => startEditing(apiKey)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✏️
                        </button>
                        <button
                          key={`delete-${apiKey.id}`}
                          onClick={() => initiateDelete(apiKey.id, apiKey.name)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the API key "{deleteConfirmation.keyName}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
