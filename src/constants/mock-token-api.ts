import { faker } from '@faker-js/faker';
import { Token } from '@/models/token';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Mock token data store
export const fakeTokens = {
  records: [] as Token[],

  // Initialize with sample data
  initialize() {
    const sampleTokens: Token[] = [];
    const platforms = ['Binance', 'Uniswap', 'PancakeSwap', 'Kucoin', 'Kraken'];
    const chains = ['Ethereum', 'BSC', 'Polygon', 'Solana', 'Avalanche'];
    // Generate dates between last 12 months
    const storeDates = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return formatDate(date);
    });

    function generateRandomTokenData(id: number): Token {
      const platform = faker.helpers.arrayElement(platforms);
      const chain = faker.helpers.arrayElement(chains);
      const tradingVolume = faker.number.float({
        min: 1000,
        max: 1000000,
        fractionDigits: 2
      });
      const tradingCount = faker.number.int({ min: 10, max: 10000 });
      const alert = faker.datatype.boolean();
      const storeTime = faker.helpers.arrayElement(storeDates);

      return {
        id,
        storeTime,
        platform,
        name: faker.finance.currencyName(),
        address: `0x${faker.string.hexadecimal({ length: 40 }).toLowerCase()}`,
        chain,
        tradingVolume,
        tradingCount,
        alert,
        metadata: {
          firstAlertTime: alert ? faker.date.recent().toISOString() : '',
          firstTransactionTime: faker.date.recent().toISOString(),
          alertCount: alert ? faker.number.int({ min: 1, max: 50 }) : 0,
          debotVolume: faker.number.float({
            min: 100,
            max: 50000,
            fractionDigits: 2
          }),
          debotTransactions: faker.number.int({ min: 5, max: 1000 }),
          maxPriceIncrease: faker.number.float({
            min: 1,
            max: 500,
            fractionDigits: 2
          }),
          maxPrice: faker.number.float({
            min: 10,
            max: 10000,
            fractionDigits: 2
          }),
          dog: faker.animal.dog(),
          zeroTimeSeconds: faker.number.int({ min: 60, max: 3600 })
        }
      };
    }

    // Generate records
    for (let i = 1; i <= 50; i++) {
      sampleTokens.push(generateRandomTokenData(i));
    }

    this.records = sampleTokens;
  },

  // Get all cross-tokens for client-side filtering and sorting
  async getAll() {
    // Simulate network delay to mimic API call that runs once per day
    await delay(500);

    // Return all cross-tokens (filtering will happen client-side)
    return this.records;
  },

  // Get a specific token by its ID
  async getTokenById(id: number) {
    await delay(500);

    const token = this.records.find((token) => token.id === id);

    if (!token) {
      return {
        success: false,
        message: `Token with ID ${id} not found`
      };
    }

    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Token with ID ${id} found`,
      token
    };
  }
};

// Initialize sample cross-tokens
fakeTokens.initialize();
