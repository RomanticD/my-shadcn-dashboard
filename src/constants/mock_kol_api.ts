// Define types for the API response
export interface KolDetail {
  chain: string;
  address: string;
  twitter_username: string;
  twitter_name: string;
  avatar: string;
  store_time: string;
  buy_counts: number;
}

export interface TokenDetails {
  kols_details: KolDetail[];
  buy_sum_counts: number;
  is_signaled: boolean;
}

export interface TokensData {
  [tokenAddress: string]: TokenDetails;
}

export interface ChainData {
  chain: string;
  store_time: string;
  tokens: TokensData;
}

// Sample KOL names and usernames for more realistic data
const kolNames = [
  '财主',
  'memeking',
  '0x3💎👋',
  'wØlf',
  'Jeff',
  'X0doge',
  '云公子',
  'Kkk【K社】',
  'blockdao🇨🇳',
  '神手',
  'CryptoWhale',
  'DeGenMax',
  'TokenTracker',
  'Satoshi2.0',
  'BullishBaron',
  'AltHunter',
  'NFTKing',
  'Web3Wizard',
  'DeFiLord',
  'MetaMaven',
  'PumpHunter',
  'Bear Market Survivor',
  '量化之王',
  '区块链先锋',
  '币圈大佬',
  '挖矿专家',
  '交易大师',
  '加密老手'
];

const usernames = [
  'caizhu_88',
  'memeeth333',
  '0x3bbbbbb',
  'a92B_',
  'Jeff03650974051',
  'Oxcool_100X',
  'nadtheos',
  'kkk_ethe',
  'mxi46636628',
  '0x_xintai',
  'crypto_whale',
  'degen_max',
  'token_tracker',
  'satoshi2_0',
  'bullish_baron',
  'alt_hunter',
  'nft_king',
  'web3_wizard',
  'defi_lord',
  'meta_maven',
  'pump_hunter',
  'bear_survivor',
  'quant_king',
  'blockchain_pioneer',
  'crypto_mogul',
  'mining_expert',
  'trade_master',
  'crypto_veteran',
  'hodler_supreme',
  'alpha_finder',
  'coin_detective'
];

// More realistic token addresses for each chain
const chainTokenAddresses = {
  bsc: [
    '0x4b2633b150b56f1191c233a57b47d30b555fd373',
    '0x540fd26540ee6f457abbe13a7ae08becd7fb4444',
    '0x7ed5461a2b87e316960a4a2ed225e8ce25b5737d',
    '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
    '0x7083609fce4d1d8dc0c979aab8c869ea2c873402'
  ],
  solana: [
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'So11111111111111111111111111111111111111112',
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6',
    'CDJWUqTcYTVAKXAVXoQZFes5JUFc7owSeq7eMQcDSbo5',
    'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4',
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'
  ],
  ethereum: [
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x514910771af9ca656af840dff83e8264ecf986ca'
  ],
  arbitrum: [
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a',
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    '0xd4d42f0b6def4ce0383636770ef773390d85c61a',
    '0x912ce59144191c1204e64559fe8253a0e49e6548'
  ]
};

// More realistic avatar URLs
const getRandomAvatar = () => {
  const avatarSources = [
    `https://pbs.twimg.com/profile_images/${Math.floor(Math.random() * 1999999999) + 1800000000}/`,
    `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100000)}`
  ];

  const source =
    avatarSources[Math.floor(Math.random() * avatarSources.length)];

  if (source.includes('twimg')) {
    const images = [
      'sXDHrGs5.jpg',
      'Uzf2yX9U.jpg',
      '5sZpHxh5.jpg',
      '0JNooElg.jpg',
      'GiyrGI-g.jpg',
      'aSVKxlFU.jpg',
      'YyAQz6Co_normal.jpg',
      's9PgQQ_s.jpg',
      'd95mItzX.jpg',
      'kxtApicT.jpg',
      'eTFmKHQe.jpg',
      'YfxFGjPk.jpg'
    ];
    return source + images[Math.floor(Math.random() * images.length)];
  }

  return source;
};

// More realistic date distribution
const getRandomDate = () => {
  // Mostly in May, but some in April
  const month = Math.random() < 0.8 ? '05' : '04';
  const day = String(Math.floor(Math.random() * 30) + 1).padStart(2, '0');
  return `2025-${month}-${day}`;
};

// Mock data for development with more diversity
export const generateMockData = (): ChainData[] => {
  const chains = ['bsc', 'solana', 'ethereum', 'arbitrum'];
  const mockData: ChainData[] = [];

  chains.forEach((chain) => {
    const tokensData: TokensData = {};

    // Use predefined token addresses for each chain
    const tokenAddresses =
      chainTokenAddresses[chain as keyof typeof chainTokenAddresses];

    // Add 5-8 tokens for each chain
    const tokenCount = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < tokenCount; i++) {
      // Use realistic token address
      const tokenAddress = tokenAddresses[i];

      // Generate 3-12 KOLs for each token with more variation
      const kolCount = Math.floor(Math.random() * 10) + 3;
      const kolsDetails: KolDetail[] = [];

      for (let j = 0; j < kolCount; j++) {
        // Get random name and username from our lists
        const nameIndex = Math.floor(Math.random() * kolNames.length);
        const usernameIndex = Math.floor(Math.random() * usernames.length);

        // Generate varied buy counts with occasional whales
        let buyCounts = 0;
        // 80% chance of small counts (1-5), 15% medium (6-15), 5% whales (16-50)
        const buyCountType = Math.random();
        if (buyCountType < 0.8) {
          buyCounts = Math.floor(Math.random() * 5) + 1;
        } else if (buyCountType < 0.95) {
          buyCounts = Math.floor(Math.random() * 10) + 6;
        } else {
          buyCounts = Math.floor(Math.random() * 35) + 16;
        }

        kolsDetails.push({
          chain,
          address: `0x${Math.random().toString(16).substring(2, 42)}`,
          twitter_username: usernames[usernameIndex],
          twitter_name: kolNames[nameIndex],
          avatar: getRandomAvatar(),
          store_time: getRandomDate(),
          buy_counts: buyCounts
        });
      }

      // Calculate total buy counts
      const buySum = kolsDetails.reduce((sum, kol) => sum + kol.buy_counts, 0);

      // Add token data with more varied signaling patterns (about 40% chance of being signaled)
      tokensData[tokenAddress] = {
        kols_details: kolsDetails,
        buy_sum_counts: buySum,
        is_signaled: Math.random() > 0.6
      };
    }

    mockData.push({
      chain,
      store_time: '2025-05-19',
      tokens: tokensData
    });
  });

  return mockData;
};

// Format data for charts
export const getTopTokensByBuyCount = (data: ChainData[], limit = 10) => {
  const allTokens: { address: string; chain: string; buyCounts: number }[] = [];

  data.forEach((chainData) => {
    Object.entries(chainData.tokens).forEach(([address, tokenData]) => {
      allTokens.push({
        address: address,
        chain: chainData.chain,
        buyCounts: tokenData.buy_sum_counts
      });
    });
  });

  return allTokens
    .sort((a, b) => b.buyCounts - a.buyCounts)
    .slice(0, limit)
    .map((token) => ({
      address:
        token.address.substring(0, 6) +
        '...' +
        token.address.substring(token.address.length - 4),
      chain: token.chain,
      buy_counts: token.buyCounts
    }));
};

export const getMostActiveKols = (data: ChainData[], limit = 10) => {
  const kolMap = new Map<
    string,
    { name: string; username: string; buyCounts: number }
  >();

  data.forEach((chainData) => {
    Object.values(chainData.tokens).forEach((tokenData) => {
      tokenData.kols_details.forEach((kol) => {
        const key = `${kol.chain}_${kol.address}`;

        if (kolMap.has(key)) {
          const existing = kolMap.get(key)!;
          kolMap.set(key, {
            ...existing,
            buyCounts: existing.buyCounts + kol.buy_counts
          });
        } else {
          kolMap.set(key, {
            name: kol.twitter_name,
            username: kol.twitter_username,
            buyCounts: kol.buy_counts
          });
        }
      });
    });
  });

  // Convert map to array and sort by buy counts
  return Array.from(kolMap.entries())
    .map(([key, value]) => ({
      id: key,
      name: value.name,
      username: value.username,
      buy_counts: value.buyCounts
    }))
    .sort((a, b) => b.buy_counts - a.buy_counts)
    .slice(0, limit);
};

// Format data for table
export const formatTableData = (data: ChainData[]) => {
  const tableData: any[] = [];

  data.forEach((chainData) => {
    Object.entries(chainData.tokens).forEach(([address, tokenData]) => {
      tableData.push({
        token_address: address,
        chain: chainData.chain,
        is_signaled: tokenData.is_signaled,
        buy_sum_counts: tokenData.buy_sum_counts,
        kols_details: tokenData.kols_details
      });
    });
  });

  return tableData;
};
