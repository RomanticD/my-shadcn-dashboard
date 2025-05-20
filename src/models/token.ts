// src/models/token.ts
// Token data model definitions

export interface TokenMetadata {
  firstAlertTime: string;
  firstTransactionTime: string;
  alertCount: number;
  debotVolume: number;
  debotTransactions: number;
  maxPriceIncrease: number;
  maxPrice: number;
  dog: string | null;
  zeroTimeSeconds: number;
}

export interface Token {
  id: number;
  storeTime: string;
  platform: string;
  name: string;
  address: string;
  chain: string;
  tradingVolume: number;
  tradingCount: number;
  alert: boolean;
  metadata: TokenMetadata;
}

export interface TokensResponse {
  success: boolean;
  time: string;
  message: string;
  total_tokens: number;
  offset: number;
  limit: number;
  tokens: Token[];
}
