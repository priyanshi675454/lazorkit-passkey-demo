'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { getLazorkitClient } from '@/lib/lazorkit';
import { isValidSolanaAddress, getExplorerUrl } from '@/lib/utils';

export default function GaslessTransfer() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; signature?: string; error?: string } | null>(null);

  const client = getLazorkitClient();

  const handleTransfer = async () => {
    if (!recipient.trim()) {
      setResult({ success: false, error: 'Please enter recipient address' });
      return;
    }

    if (!isValidSolanaAddress(recipient)) {
      setResult({ success: false, error: 'Invalid Solana address' });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setResult({ success: false, error: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const txResult = await client.sendGaslessTransfer(recipient, amountNum);
      
      if (txResult.success) {
        setResult({ success: true, signature: txResult.signature });
        setRecipient('');
        setAmount('');
      } else {
        setResult({ success: false, error: txResult.error || 'Transfer failed' });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        error: 'Transfer failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Send className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gasless Transfer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Send SOL with zero gas fees
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 dark:text-white font-mono text-sm transition-all"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-5 py-4 pr-20 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 dark:text-white text-xl font-bold transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold text-lg">
                SOL
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {[0.1, 0.5, 1, 2].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 rounded-xl font-bold text-gray-700 dark:text-gray-300 transition-all border-2 border-purple-200 dark:border-purple-800 hover:scale-105"
                >
                  {val} SOL
                </button>
              ))}
            </div>
          </div>

          {/* Gasless Feature Banner */}
          <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Zap className="w-6 h-6 text-yellow-900" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  ⚡ Gasless Transactions Enabled
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  All transaction fees are sponsored by Lazorkit's smart wallet technology. 
                  You don't need to hold SOL for gas fees - just send what you want!
                </p>
              </div>
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`rounded-2xl p-6 border-2 animate-fadeIn ${
              result.success 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
            }`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-lg font-bold mb-2 ${
                    result.success 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    {result.success ? '🎉 Transfer Successful!' : '❌ Transfer Failed'}
                  </p>
                  {result.success && result.signature && (
                    <a
                      href={getExplorerUrl(result.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 font-semibold mt-2 hover:underline"
                    >
                      View on Solana Explorer
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                  {result.error && (
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {result.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:cursor-not-allowed hover:scale-105 active:scale-95 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing Transfer...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                Send Transfer
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400 leading-relaxed">
            <span className="font-bold text-gray-900 dark:text-white">💡 Powered by Lazorkit</span>
            <br />
            All transactions are secured with passkey authentication and processed gaslessly
          </p>
        </div>
      </div>
    </div>
  );
}