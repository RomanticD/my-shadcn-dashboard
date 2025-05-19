// Platform options for filter
export const PLATFORM_OPTIONS = [
  { value: 'Binance', label: 'Binance' },
  { value: 'Uniswap', label: 'Uniswap' },
  { value: 'PancakeSwap', label: 'PancakeSwap' },
  { value: 'Kucoin', label: 'Kucoin' },
  { value: 'Kraken', label: 'Kraken' }
];

// Alert status options for filter
export const ALERT_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' }
];

// Chain options for filter
export const CHAIN_OPTIONS = [
  { value: 'Ethereum', label: 'Ethereum' },
  { value: 'BSC', label: 'BSC' },
  { value: 'Polygon', label: 'Polygon' },
  { value: 'Solana', label: 'Solana' },
  { value: 'Avalanche', label: 'Avalanche' }
];

// Generate store time options for the last 12 months
function generateStoreTimeOptions() {
  const options = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    options.push({
      value: formattedDate,
      label: formattedDate
    });
  }

  return options;
}

export const STORE_TIME_OPTIONS = generateStoreTimeOptions();
