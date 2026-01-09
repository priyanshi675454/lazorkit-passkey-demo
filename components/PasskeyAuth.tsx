'use client';

import { useState } from 'react';
import { Fingerprint, Loader2, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { getLazorkitClient, WalletData } from '@/lib/lazorkit';
import { generateUsername } from '@/lib/utils';

interface PasskeyAuthProps {
  onAuthSuccess: (wallet: WalletData) => void;
}

export default function PasskeyAuth({ onAuthSuccess }: PasskeyAuthProps) {
  const [mode, setMode] = useState<'select' | 'create' | 'login'>('select');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const client = getLazorkitClient();

  const handleCreateWallet = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const wallet = await client.createPasskeyWallet(username);
      onAuthSuccess(wallet);
    } catch (err) {
      setError('Failed to create wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const wallet = await client.authenticateWithPasskey(username);
      onAuthSuccess(wallet);
    } catch (err) {
      setError('Wallet not found. Please create a new wallet.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'select') {
    return (
      <div className="w-full max-w-md mx-auto animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-xl">
              <Fingerprint className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome to Lazorkit
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Passwordless Solana wallet powered by passkeys
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              <UserPlus className="w-6 h-6" />
              Create New Wallet
            </button>

            <button
              onClick={() => setMode('login')}
              className="group w-full flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 hover:scale-105"
            >
              <LogIn className="w-6 h-6" />
              Sign In
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Secure</p>
              </div>
              <div>
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Fast</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🌐</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Universal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
        <button
          onClick={() => {
            setMode('select');
            setError('');
            setUsername('');
          }}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 font-medium transition-colors"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl mb-4 shadow-lg">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {mode === 'create' ? 'Create Your Wallet' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'create' ? 'Choose a username to get started' : 'Enter your username to sign in'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="flex-1 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 dark:text-white transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    mode === 'create' ? handleCreateWallet() : handleLogin();
                  }
                }}
              />
              {mode === 'create' && (
                <button
                  onClick={() => setUsername(generateUsername())}
                  className="px-5 py-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 rounded-xl transition-all border-2 border-purple-200 dark:border-purple-800"
                  title="Generate random username"
                >
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 animate-fadeIn">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={mode === 'create' ? handleCreateWallet : handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Fingerprint className="w-6 h-6" />
                {mode === 'create' ? 'Create Wallet' : 'Sign In'}
              </>
            )}
          </button>
        </div>

        {mode === 'create' && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    What is a Passkey?
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Passkeys use your device's biometric authentication to secure your wallet. 
                    No passwords, no seed phrases - just simple, secure access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}