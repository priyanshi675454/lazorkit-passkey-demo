/**
 * Utility functions for Lazorkit Passkey Demo
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatSOL(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function getConnection(): Connection {
  return new Connection('https://api.devnet.solana.com', 'confirmed');
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function getExplorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function generateUsername(): string {
  const adjectives = ['Swift', 'Bright', 'Cosmic', 'Digital', 'Quantum'];
  const nouns = ['Trader', 'Whale', 'Explorer', 'Pioneer', 'Builder'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}