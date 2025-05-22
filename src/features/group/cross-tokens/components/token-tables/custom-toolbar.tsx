'use client';

import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import * as React from 'react';
import {
  ALERT_OPTIONS,
  PLATFORM_OPTIONS,
  CHAIN_OPTIONS,
  STORE_TIME_OPTIONS,
  ZERO_TIME_OPTIONS
} from './options';

interface TokenTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
}

export function TokenTableToolbar<TData>({
  table,
  className,
  ...props
}: TokenTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const nameColumn = table.getColumn('name');
  const alertColumn = table.getColumn('alert');
  const platformColumn = table.getColumn('platform');
  const chainColumn = table.getColumn('chain');
  const storeTimeColumn = table.getColumn('storeTime');
  const zeroTimeColumn = table.getColumn('zeroTimeSeconds');

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        {/* Name search input */}
        {nameColumn && (
          <Input
            placeholder='Search tokens...'
            value={(nameColumn.getFilterValue() as string) ?? ''}
            onChange={(event) => nameColumn.setFilterValue(event.target.value)}
            className='h-8 w-40 lg:w-56'
          />
        )}

        {/* StoreTime filter - displayed first */}
        {storeTimeColumn && (
          <DataTableFacetedFilter
            column={storeTimeColumn}
            title='筛选日期'
            options={STORE_TIME_OPTIONS}
            multiple={true}
          />
        )}

        {/* Platform filter - displayed second */}
        {platformColumn && (
          <DataTableFacetedFilter
            column={platformColumn}
            title='筛选平台'
            options={PLATFORM_OPTIONS}
            multiple={true}
          />
        )}

        {/* Alert filter - displayed third */}
        {alertColumn && (
          <DataTableFacetedFilter
            column={alertColumn}
            title='筛选告警'
            options={ALERT_OPTIONS}
            multiple={true}
          />
        )}

        {/* Chain filter - displayed fourth */}
        {chainColumn && (
          <DataTableFacetedFilter
            column={chainColumn}
            title='筛选链'
            options={CHAIN_OPTIONS}
            multiple={true}
          />
        )}

        {/* Zero Time filter - displayed fifth, after Chain filter */}
        {zeroTimeColumn && (
          <DataTableFacetedFilter
            column={zeroTimeColumn}
            title='筛选归零'
            options={ZERO_TIME_OPTIONS}
            multiple={true}
          />
        )}

        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='outline'
            size='sm'
            className='border-dashed'
            onClick={() => table.resetColumnFilters()}
          >
            <Cross2Icon />
            Reset
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
