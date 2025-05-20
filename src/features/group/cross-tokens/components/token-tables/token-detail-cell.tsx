'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';
import { Token } from '@/models/token';
import { IconInfoCircle } from '@tabler/icons-react';
import { format } from 'date-fns';

interface TokenDetailCellProps {
  token: Token;
}

export function TokenDetailCell({ token }: TokenDetailCellProps) {
  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='sm' className='gap-1'>
            <IconInfoCircle className='h-4 w-4' />
            Details
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className='bg-card border-border w-96 p-4 shadow-lg'
          sideOffset={5}
        >
          <div className='text-card-foreground flex flex-col gap-1.5 text-sm'>
            <div className='flex'>
              <span className='w-44 font-medium'>First Alert Time:</span>
              <span>{formatDate(token.metadata.firstAlertTime)}</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>First Transaction Time:</span>
              <span>{formatDate(token.metadata.firstTransactionTime)}</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>Alert Count:</span>
              <span>{token.metadata.alertCount}</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>Debot Volume:</span>
              <span>{formatNumber(token.metadata.debotVolume)}</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>Debot Transactions:</span>
              <span>{formatNumber(token.metadata.debotTransactions, 0)}</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>Max Price Increase:</span>
              <span>{formatNumber(token.metadata.maxPriceIncrease)}%</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>Max Price:</span>
              <span>${formatNumber(token.metadata.maxPrice)}</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>Dog:</span>
              <span>{token.metadata.dog}</span>
            </div>
            <div className='flex'>
              <span className='w-44 font-medium'>Zero Time:</span>
              <span>{token.metadata.zeroTimeSeconds} seconds</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
