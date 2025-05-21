'use client';

import type { Column } from '@tanstack/react-table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          'text-muted-foreground px-3 py-3 text-center text-sm font-medium',
          className
        )}
      >
        {title}
      </div>
    );
  }

  return (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting()}
      className={cn(
        'hover:bg-muted focus-visible:ring-ring flex h-auto w-full items-center justify-center rounded-md px-3 py-3 text-center focus-visible:ring-1 focus-visible:ring-offset-0',
        className
      )}
    >
      <span className='flex-grow text-sm font-medium'>{title}</span>
      <div className='ml-2 h-4 w-4 flex-shrink-0'>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className='h-4 w-4' />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className='h-4 w-4' />
        ) : (
          <CaretSortIcon className='h-4 w-4' />
        )}
      </div>
    </Button>
  );
}
