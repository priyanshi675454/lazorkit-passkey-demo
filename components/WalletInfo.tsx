'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Wallet, RefreshCw, LogOut, Gift, User } from 'lucide-react';
import { WalletData, getLazorkitClient } from '@/lib/lazorkit';
import { shortenAddress, copyToClipboard, getExplorerUrl } from '@/lib/utils';

interface WalletInfoProps {
  wallet: WalletData;
  onDisconnect: () => void;
}

export default function WalletInfo({ wallet, onDisconnect }: WalletInfoProps) {
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [airdropping, setAirdropping] = useState(false);

  const client = getLazorkitClient();

  const loadBalance = async () => {
    setLoading(true);
    try {
      const bal = await client.getBalance();
      setBalance(bal);
    } catch (error) {
      console.error('Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const handleCopy = async () => {
    const success = await copyToClipboard(wallet.publicKey);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAirdrop = async () => {
    setAirdropping(true);
    try {
      await client.requestAirdrop(1);
      setTimeout(() => loadBalance(), 2000);
    } catch (error) {
      console.error('Airdrop failed');
    } finally {
      setAirdropping(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border-2 border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {wallet.username}
              </h3>
              <p className="text-purple-100 font-medium">
                Passkey Wallet
              </p>
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white rounded-xl transition-all font-semibold border-2 border-white/30 hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            Disconnect
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Balance
            </span>
            <button
              onClick={loadBalance}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              {balance.toFixed(4)}
            </span>
            <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">SOL</span>
          </div>
          <button
            onClick={handleAirdrop}
            disabled={airdropping}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            {airdropping ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Requesting Airdrop...
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                Request Airdrop (1 SOL)
              </>
            )}
          </button>
        </div>

        {/* Address Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Wallet Address
            </span>
            <a
              href={getExplorerUrl(wallet.publicKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              View Explorer
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl px-5 py-4 font-mono text-sm text-gray-900 dark:text-white overflow-x-auto border-2 border-gray-200 dark:border-gray-700">
              {wallet.publicKey}
            </div>
            <button
              onClick={handleCopy}
              className="p-4 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-xl transition-all border-2 border-purple-200 dark:border-purple-800"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="font-mono font-semibold">Short:</span>
            <span className="font-mono">{shortenAddress(wallet.publicKey, 8)}</span>
          </div>
        </div>

        {/* Network Badge */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-xl rounded-full border-2 border-white/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-white">Connected to Solana Devnet</span>
          </div>
        </div>
      </div>
    </div>
  );
}