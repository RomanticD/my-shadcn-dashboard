'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Token } from '@/models/token';
import { Column, ColumnDef, FilterFn } from '@tanstack/react-table';
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Text,
  XCircle,
  CalendarDays,
  AlertCircle,
  Clock,
  CircleDot
} from 'lucide-react';
import {
  ALERT_OPTIONS,
  PLATFORM_OPTIONS,
  CHAIN_OPTIONS,
  STORE_TIME_OPTIONS,
  ZERO_TIME_OPTIONS
} from './options';
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { format } from 'date-fns';

const booleanFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  const value = row.getValue(columnId) as boolean;
  const booleanValues = filterValue.map((val) => val === 'true');
  return booleanValues.includes(value);
};

const multiSelectFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  const value = row.getValue(columnId) as string;
  return filterValue.includes(value);
};

const dogFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  const value = row.getValue(columnId) as string;
  return filterValue.includes(value);
};

const AddressCell = ({ value, chain }: { value: string; chain: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Address copied', {
      description: 'Token address copied to clipboard'
    });
  };

  const handleOpenExternalLink = () => {
    window.open(`https://debot.ai/token/${chain}/${value}`, '_blank');
  };

  return (
    <div className='flex items-center gap-2'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={handleCopy}
            >
              <Copy className='h-3.5 w-3.5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy address</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={handleOpenExternalLink}
            >
              <ExternalLink className='h-3.5 w-3.5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View on Debot</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// Format dates for display
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'MM/dd/yyyy');
};

// Format time for display (hours, minutes, seconds only)
const formatTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'HH:mm:ss');
};

// Format percentage with multiplication and single decimal place
const formatPercentage = (value: number) => {
  if (value === null || value === undefined) return 'N/A';
  return (value * 100).toFixed(1);
};

// Zero time filter function
const zeroTimeFilterFn: FilterFn<Token> = (row, columnId, filterValue) => {
  if (filterValue.length === 0) return true;

  const zeroTimeValue = row.original.metadata.zeroTimeSeconds;

  return filterValue.some((option: string) => {
    switch (option) {
      case 'zero':
        return zeroTimeValue === 0;
      case '0-1000':
        return zeroTimeValue > 0 && zeroTimeValue <= 1000;
      case 'gt1000':
        return zeroTimeValue > 1000;
      default:
        return false;
    }
  });
};

// Format maxPrice value to display all significant decimal places efficiently
const formatMaxPrice = (value: number) => {
  if (value === null || value === undefined) return 'N/A';

  // Convert to string to preserve all significant digits
  const stringValue = value.toString();

  // If it's an integer or has few decimal places, return as is
  if (!stringValue.includes('.') || stringValue.split('.')[1].length <= 2) {
    return stringValue;
  }

  // For values with many decimal places, use scientific notation if very small
  if (value < 0.0001) {
    return value.toExponential(4);
  }

  // Otherwise return the full value to preserve all decimal places
  return stringValue;
};

export const columns: ColumnDef<Token>[] = [
  {
    id: 'storeTime',
    accessorKey: 'storeTime',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Store Time' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true,
    filterFn: multiSelectFilterFn,
    enableSorting: true,
    meta: {
      label: 'Store Time',
      variant: 'multiSelect',
      options: STORE_TIME_OPTIONS
    }
  },
  {
    id: 'platform',
    accessorKey: 'platform',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Platform' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true,
    filterFn: multiSelectFilterFn,
    meta: {
      label: 'Platform',
      variant: 'multiSelect',
      options: PLATFORM_OPTIONS
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Token Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: 'Token Name',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ cell, row }) => (
      <AddressCell value={cell.getValue<string>()} chain={row.original.chain} />
    ),
    meta: {
      label: 'Address',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'chain',
    accessorKey: 'chain',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Chain' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    enableColumnFilter: true,
    filterFn: multiSelectFilterFn,
    meta: {
      label: 'Chain',
      variant: 'multiSelect',
      options: CHAIN_OPTIONS
    }
  },
  {
    id: 'tradingVolume',
    accessorKey: 'tradingVolume',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trading Volume' />
    ),
    cell: ({ cell }) => <div>{formatNumber(cell.getValue<number>(), 2)}</div>,
    enableSorting: true,
    meta: {
      label: 'Trading Volume'
    }
  },
  {
    id: 'tradingCount',
    accessorKey: 'tradingCount',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trading Count' />
    ),
    cell: ({ cell }) => <div>{formatNumber(cell.getValue<number>(), 0)}</div>,
    enableSorting: true,
    meta: {
      label: 'Trading Count'
    }
  },
  {
    id: 'alert',
    accessorKey: 'alert',
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Signal' />
    ),
    cell: ({ cell }) => {
      const alertValue = cell.getValue<boolean>();
      const Icon = alertValue ? CheckCircle2 : XCircle;

      return (
        <Badge
          variant={alertValue ? 'success' : 'destructive'}
          className='capitalize'
        >
          <Icon className='mr-1 h-3.5 w-3.5' />
          {alertValue ? 'Yes' : 'No'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    filterFn: booleanFilterFn,
    meta: {
      label: 'Signal',
      variant: 'multiSelect',
      options: ALERT_OPTIONS
    }
  },
  {
    id: 'firstAlertTime',
    accessorFn: (row) => row.metadata.firstAlertTime,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='First Alert' />
    ),
    cell: ({ row }) => (
      <div>
        {!row.original.alert
          ? 'N/A'
          : formatTime(row.original.metadata.firstAlertTime)}
      </div>
    ),
    enableSorting: true
  },
  {
    id: 'firstTransactionTime',
    accessorFn: (row) => row.metadata.firstTransactionTime,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='First Tx' />
    ),
    cell: ({ row }) => (
      <div>
        {!row.original.alert
          ? 'N/A'
          : formatTime(row.original.metadata.firstTransactionTime)}
      </div>
    ),
    enableSorting: true
  },
  {
    id: 'alertCount',
    accessorFn: (row) => row.metadata.alertCount,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Alert Count' />
    ),
    cell: ({ row }) => (
      <div>
        {!row.original.alert ? 'N/A' : row.original.metadata.alertCount}
      </div>
    ),
    enableSorting: true
  },
  {
    id: 'debotVolume',
    accessorFn: (row) => row.metadata.debotVolume,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Debot Vol' />
    ),
    cell: ({ row }) => (
      <div>{formatNumber(row.original.metadata.debotVolume)}</div>
    ),
    enableSorting: true
  },
  {
    id: 'debotTransactions',
    accessorFn: (row) => row.metadata.debotTransactions,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Debot Tx' />
    ),
    cell: ({ row }) => (
      <div>{formatNumber(row.original.metadata.debotTransactions, 0)}</div>
    ),
    enableSorting: true
  },
  {
    id: 'maxPriceIncrease',
    accessorFn: (row) => row.metadata.maxPriceIncrease,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Max Price Inc' />
    ),
    cell: ({ row }) => (
      <div>
        {!row.original.alert
          ? 'N/A'
          : `${formatPercentage(row.original.metadata.maxPriceIncrease)}%`}
      </div>
    ),
    enableSorting: true
  },
  {
    id: 'maxPrice',
    accessorFn: (row) => row.metadata.maxPrice,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Max Price' />
    ),
    cell: ({ row }) => (
      <div>
        {!row.original.alert
          ? 'N/A'
          : `$${formatMaxPrice(row.original.metadata.maxPrice)}`}
      </div>
    ),
    enableSorting: true
  },
  {
    id: 'dog',
    accessorFn: (row) => row.metadata.dog,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Dog' />
    ),
    cell: ({ row }) => {
      if (!row.original.alert) {
        return <div className='text-muted-foreground text-sm'>N/A</div>;
      }

      const dogValue = row.original.metadata.dog;

      if (!dogValue) {
        return <div className='text-muted-foreground text-sm'>-</div>;
      }

      let badgeVariant = 'outline';
      let badgeText = dogValue;

      if (dogValue === '金狗') {
        badgeVariant = 'gold';
        badgeText = '金狗';
      } else if (dogValue === '银狗') {
        badgeVariant = 'silver';
        badgeText = '银狗';
      } else if (dogValue === '铜狗') {
        badgeVariant = 'bronze';
        badgeText = '铜狗';
      }

      return (
        <Badge variant={badgeVariant as any} className='capitalize'>
          <CircleDot className='mr-1 h-3.5 w-3.5' />
          {badgeText}
        </Badge>
      );
    },
    enableColumnFilter: true,
    filterFn: dogFilterFn,
    meta: {
      label: 'Dog',
      variant: 'multiSelect',
      options: [
        { label: '金狗', value: '金狗' },
        { label: '银狗', value: '银狗' },
        { label: '铜狗', value: '铜狗' },
        { label: 'None', value: '' }
      ]
    },
    enableSorting: true
  },
  {
    id: 'zeroTimeSeconds',
    accessorFn: (row) => row.metadata.zeroTimeSeconds,
    header: ({ column }: { column: Column<Token, unknown> }) => (
      <DataTableColumnHeader column={column} title='Zero Time' />
    ),
    cell: ({ row }) => (
      <div>
        {!row.original.alert ? 'N/A' : row.original.metadata.zeroTimeSeconds}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: zeroTimeFilterFn,
    meta: {
      label: 'Zero Time',
      variant: 'multiSelect',
      options: ZERO_TIME_OPTIONS
    }
  }
];
