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
  CalendarDays
} from 'lucide-react';
import {
  ALERT_OPTIONS,
  PLATFORM_OPTIONS,
  CHAIN_OPTIONS,
  STORE_TIME_OPTIONS
} from './options';
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { TokenDetailCell } from './token-detail-cell';

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
      <div className='max-w-[140px] truncate font-mono text-xs' title={value}>
        {value}
      </div>
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
    id: 'details',
    header: 'Details',
    cell: ({ row }) => <TokenDetailCell token={row.original} />
  }
];
