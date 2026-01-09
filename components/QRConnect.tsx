'use client';

import { useState, useEffect } from 'react';
import { QrCode, Smartphone, RefreshCw, Check, Copy } from 'lucide-react';
import { WalletData } from '@/lib/lazorkit';
import { copyToClipboard } from '@/lib/utils';

interface QRConnectProps {
  wallet: WalletData;
}

export default function QRConnect({ wallet }: QRConnectProps) {
  const [connectionUrl, setConnectionUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [regenerated, setRegenerated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `lazorkit://connect?address=${wallet.publicKey}&username=${wallet.username}`;
    setConnectionUrl(url);
    generateQRCode(url);
  }, [wallet]);

  const generateQRCode = (url: string) => {
    // Using Google Charts API to generate QR code (no package needed!)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrUrl);
  };

  const regenerateQR = () => {
    const timestamp = Date.now();
    const url = `lazorkit://connect?address=${wallet.publicKey}&username=${wallet.username}&t=${timestamp}`;
    setConnectionUrl(url);
    generateQRCode(url);
    setRegenerated(true);
    setTimeout(() => setRegenerated(false), 2000);
  };

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(connectionUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mobile Connect
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Scan QR code to access on mobile
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {!showQR ? (
            <div className="w-full text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-3xl mb-6">
                <Smartphone className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <button
                onClick={() => setShowQR(true)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                <QrCode className="w-6 h-6" />
                Generate QR Code
              </button>
            </div>
          ) : (
            <>
              {/* QR Code Display */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-3xl shadow-inner border-4 border-purple-200 dark:border-purple-800 mb-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-72 h-72 mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  ) : (
                    <div className="w-72 h-72 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-xl">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">Loading QR Code...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connection URL */}
              <div className="w-full mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Connection URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl px-5 py-4 font-mono text-xs text-gray-900 dark:text-white overflow-x-auto border-2 border-gray-200 dark:border-gray-700">
                    {connectionUrl}
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className="p-4 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-xl transition-all border-2 border-purple-200 dark:border-purple-800"
                    title="Copy URL"
                  >
                    {copied ? (
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={regenerateQR}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-semibold border-2 border-purple-200 dark:border-purple-800 hover:scale-105"
                >
                  {regenerated ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      Regenerated!
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Regenerate
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-semibold hover:scale-105"
                >
                  Hide QR
                </button>
              </div>
            </>
          )}

          {/* Instructions */}
          <div className="w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900 dark:text-white mb-3">
                  How to Connect on Mobile:
                </p>
                <ol className="space-y-2">
                  <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <span>Open Lazorkit mobile app on your phone</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <span>Tap "Scan QR Code" in the app menu</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <span>Point your camera at the QR code above</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                    <span>Confirm the connection with your passkey</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Security Notice
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Only scan this QR code on devices you trust. This code grants access to your 
                  wallet using passkey authentication. Never share this QR code with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}