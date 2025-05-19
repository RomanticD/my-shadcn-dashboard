'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { formatNumber } from '@/lib/utils';
import { Token } from '@/models/token';
import { IconInfoCircle } from '@tabler/icons-react';
import { format } from 'date-fns';

interface TokenDetailCellProps {
  token: Token;
}

export function TokenDetailCell({ token }: TokenDetailCellProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='gap-1'>
          <IconInfoCircle className='h-4 w-4' />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            {token.name}
            <span className='text-muted-foreground text-sm font-normal'>
              ({token.platform})
            </span>
          </DialogTitle>
          <DialogDescription>
            <span className='font-mono text-xs break-all'>{token.address}</span>
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-4 py-4'>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              Store Time
            </p>
            <p className='text-sm'>{token.storeTime}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              First Signal Time
            </p>
            <p className='text-sm'>
              {formatDate(token.metadata.firstAlertTime)}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              First Transaction Time
            </p>
            <p className='text-sm'>
              {formatDate(token.metadata.firstTransactionTime)}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              Signal Count
            </p>
            <p className='text-sm'>{token.metadata.alertCount}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              Debot Volume
            </p>
            <p className='text-sm'>
              {formatNumber(token.metadata.debotVolume)}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              Debot Transactions
            </p>
            <p className='text-sm'>
              {formatNumber(token.metadata.debotTransactions, 0)}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              Max Price Increase
            </p>
            <p className='text-sm'>
              {formatNumber(token.metadata.maxPriceIncrease)}%
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              Max Price
            </p>
            <p className='text-sm'>${formatNumber(token.metadata.maxPrice)}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>Dog</p>
            <p className='text-sm'>{token.metadata.dog}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>
              Zero Time
            </p>
            <p className='text-sm'>{token.metadata.zeroTimeSeconds} seconds</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
