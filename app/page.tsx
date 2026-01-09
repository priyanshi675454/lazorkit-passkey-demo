'use client';

import { useState } from 'react';
import { Zap, Send, QrCode } from 'lucide-react';
import PasskeyAuth from '@/components/PasskeyAuth';
import WalletInfo from '@/components/WalletInfo';
import GaslessTransfer from '@/components/GaslessTransfer';
import QRConnect from '@/components/QRConnect';
import { WalletData } from '@/lib/lazorkit';

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [activeTab, setActiveTab] = useState<'transfer' | 'qr'>('transfer');

  const handleAuthSuccess = (walletData: WalletData) => {
    setWallet(walletData);
  };

  const handleDisconnect = () => {
    setWallet(null);
    setActiveTab('transfer');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-2xl p-3 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Lazorkit Demo
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Passwordless Solana Wallet
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-bold border-2 border-green-300 dark:border-green-800">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Devnet
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {!wallet ? (
          /* Authentication Screen */
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
            <div className="text-center mb-12 max-w-3xl">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Welcome to Lazorkit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Experience the future of Solana wallets with passkey technology. 
                <br />
                No extensions, no seed phrases, just seamless authentication.
              </p>
            </div>
            <PasskeyAuth onAuthSuccess={handleAuthSuccess} />
            
            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 border-2 border-purple-200 dark:border-purple-800">
                  <span className="text-3xl">🔐</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Passkey Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Use biometric authentication on any device. Works with Touch ID, Face ID, 
                  Windows Hello, and Android biometrics.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 border-2 border-blue-200 dark:border-blue-800">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Gasless Transactions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Send tokens without paying gas fees. Powered by Lazorkit's smart 
                  wallet technology with sponsored transactions.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 border-2 border-green-200 dark:border-green-800">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Cross-Device
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Access your wallet from desktop, mobile, or tablet. Seamlessly 
                  connect across devices with QR codes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Wallet Dashboard */
          <div className="space-y-8">
            <WalletInfo wallet={wallet} onDisconnect={handleDisconnect} />

            {/* Tabs */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('transfer')}
                className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  activeTab === 'transfer'
                    ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white scale-105 shadow-2xl'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <Send className="w-5 h-5" />
                Send Transfer
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  activeTab === 'qr'
                    ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white scale-105 shadow-2xl'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <QrCode className="w-5 h-5" />
                QR Connect
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'transfer' && <GaslessTransfer />}
            {activeTab === 'qr' && <QRConnect wallet={wallet} />}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-lg">
              Built with <span className="text-red-500">❤️</span> using{' '}
              <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Lazorkit SDK
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Demo application showcasing passkey integration on Solana Devnet
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}