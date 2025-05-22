export interface TimeRangeData {
  range: string;
  gmgn_count: number;
  gmgn_volume: number;
  debot_count: number;
  debot_volume: number;
}

export interface Token {
  rank: number;
  token_name: string;
  token_address: string;
  chain: string;
  gmgn_total_volume: number;
  gmgn_total_trades: number;
  debot_total_volume: number;
  debot_total_trades: number;
  time_range: TimeRangeData[];
}

export interface TokenTrendsItem {
  query_id: number;
  store_time: string;
  tokens: Token[];
  date: number;
}

export interface TokenTrendsResponse {
  code: number;
  description: string;
  data: {
    items: TokenTrendsItem[];
  };
}

// Generate time range data for full day (00:00-24:00) in 10 minute intervals
const generateTimeRanges = (): TimeRangeData[] => {
  const timeRanges: TimeRangeData[] = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const startHour = hour.toString().padStart(2, '0');
      const startMinute = minute.toString().padStart(2, '0');
      const endMinute = (minute + 9).toString().padStart(2, '0');

      const range = `${startHour}:${startMinute}-${startHour}:${endMinute}`;

      timeRanges.push({
        range,
        gmgn_count: Math.floor(Math.random() * 30),
        gmgn_volume: Math.random() * 10000,
        debot_count: Math.floor(Math.random() * 5),
        debot_volume: Math.random() * 500
      });
    }
  }

  return timeRanges;
};

// Generate tokens with realistic data
const generateTokens = (date: string): Token[] => {
  const tokenSymbols = [
    'DIS',
    'SOL',
    'USDT',
    'ETH',
    'BTC',
    'BONK',
    'DOGE',
    'MATIC',
    'XRP',
    'ADA'
  ];
  const chains = [
    'solana',
    'ethereum',
    'solana',
    'ethereum',
    'bitcoin',
    'solana',
    'solana',
    'polygon',
    'ripple',
    'cardano'
  ];
  const addresses = [
    '2AEU9yWk3dEGnVwRaKv4div5TarC4dn7axFLyz6zG4Pf',
    '0x123456789abcdef0123456789abcdef012345678',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    '8XCieCP9in7SZvCkYvugFzKtpMLZ7SBq8EbsMhAVnPXF',
    'DBXcLpWyesgAyZJXFBmPwsEYQkVvLBfMUar8tUq5oJtx',
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    'rBWpYJhuJWBPAkznJYkJN8jfVe2vzNJPMC',
    'addr1qy8ac7qqy0vtulyl7wuaapnd5858ls2z2fc97f28kdtw2mwqpgta0fjcc4khj5t9gupnvqcwd9qcjyexrcv4qum20pcsnzt83j'
  ];

  return tokenSymbols.map((symbol, index) => {
    const gmgn_total_volume = Math.random() * 500000 + 50000;
    const gmgn_total_trades = Math.floor(Math.random() * 1000 + 100);
    const debot_total_volume = Math.random() * 5000 + 500;
    const debot_total_trades = Math.floor(Math.random() * 100 + 10);

    return {
      rank: index + 1,
      token_name: symbol,
      token_address: addresses[index],
      chain: chains[index],
      gmgn_total_volume,
      gmgn_total_trades,
      debot_total_volume,
      debot_total_trades,
      time_range: generateTimeRanges()
    };
  });
};

// Create mock data for three different dates
const createMockData = (): TokenTrendsResponse => {
  const currentDate = new Date();
  const items: TokenTrendsItem[] = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const timestamp = Math.floor(date.getTime() / 1000);

    items.push({
      query_id: 5165709 + i,
      store_time: formattedDate,
      tokens: generateTokens(formattedDate),
      date: timestamp
    });
  }

  return {
    code: 200,
    description: 'Successfully fetched GMGN Debot data.',
    data: {
      items
    }
  };
};

export const tokenTrendsData = createMockData();
