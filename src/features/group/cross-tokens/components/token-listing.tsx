import { TokenTable } from './token-tables';
import { columns } from './token-tables/columns';
import { Token, TokenMetadata } from '@/models/token';

// Define API response interface matching the specified structure
interface TokenApiResponse {
  code: number;
  description: string;
  data: Array<{
    date: number;
    platforms: Array<{
      platform_name: string;
      tokens: Array<{
        token_name: string;
        token_address: string;
        trade_volume: number;
        trade_count: number;
        is_signaled: boolean;
        token_debot_info: {
          chain: string;
          first_signal_time: number | null;
          first_trade_time: number | null;
          signal_count: number;
          trade_volume: number;
          trade_count: number;
          max_increase: number | null;
          max_price: number | null;
          dog: string | null;
          to_zero_seconds: number | null;
        } | null;
        chain: string;
      }>;
      total_volume: number;
      total_trades: number;
      avg_volume: number;
      tokens_count: number;
    }>;
  }>;
}

type TokenListingPageProps = {};

export default async function TokenListingPage({}: TokenListingPageProps) {
  // Calculate timestamp for 1:00 AM of previous day
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(1, 0, 0, 0);
  const startTimestamp = Math.floor(yesterday.getTime() / 1000);

  // Fetch data from API
  const response = await fetch(
    `http://localhost:3001/api/graph/token-summary?start_time=${startTimestamp}`,
    {
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const apiData: TokenApiResponse = await response.json();

  // Transform API data to match our Token interface
  const transformedTokens: Token[] = [];
  let idCounter = 1;

  // Process all platforms and tokens from the API response
  apiData.data.forEach((dayData) => {
    dayData.platforms.forEach((platform) => {
      platform.tokens.forEach((apiToken) => {
        // Format store time as a readable date string
        const storeTime = new Date(dayData.date * 1000)
          .toISOString()
          .split('T')[0];

        // Create token metadata
        const metadata: TokenMetadata = {
          firstAlertTime: apiToken.token_debot_info?.first_signal_time
            ? new Date(
                apiToken.token_debot_info.first_signal_time * 1000
              ).toISOString()
            : '',
          firstTransactionTime: apiToken.token_debot_info?.first_trade_time
            ? new Date(
                apiToken.token_debot_info.first_trade_time * 1000
              ).toISOString()
            : '',
          alertCount: apiToken.token_debot_info?.signal_count || 0,
          debotVolume: apiToken.token_debot_info?.trade_volume || 0,
          debotTransactions: apiToken.token_debot_info?.trade_count || 0,
          maxPriceIncrease: apiToken.token_debot_info?.max_increase || 0,
          maxPrice: apiToken.token_debot_info?.max_price || 0,
          dog: apiToken.token_debot_info?.dog || null,
          zeroTimeSeconds: apiToken.token_debot_info?.to_zero_seconds || 0
        };

        // Create transformed token
        transformedTokens.push({
          id: idCounter++,
          storeTime,
          platform: platform.platform_name,
          name: apiToken.token_name,
          address: apiToken.token_address,
          chain: apiToken.chain,
          tradingVolume: apiToken.trade_volume,
          tradingCount: apiToken.trade_count,
          alert: apiToken.is_signaled,
          metadata
        });
      });
    });
  });

  return <TokenTable data={transformedTokens} columns={columns} />;
}
