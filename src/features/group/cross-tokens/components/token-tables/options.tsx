// Platform options for filter
export const PLATFORM_OPTIONS = [
  { value: 'gmgn', label: 'gmgn' },
  { value: 'debot', label: 'debot' },
  { value: 'axiom', label: 'axiom' },
  { value: 'pepe', label: 'pepe' },
  { value: 'photon', label: 'photon' }
];

// Alert status options for filter
export const ALERT_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' }
];

// Chain options for filter
export const CHAIN_OPTIONS = [
  { value: 'solana', label: 'solana' },
  { value: 'bsc', label: 'bsc' },
  { value: 'base', label: 'base' }
];

// Zero time filter options
export const ZERO_TIME_OPTIONS = [
  { value: 'zero', label: '0' },
  { value: '0-1000', label: '0-1000' },
  { value: 'gt1000', label: '> 1000' }
];

// Generate store time options for today, yesterday, and the day before yesterday
function generateStoreTimeOptions() {
  const options = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

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
