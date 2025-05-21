'use client';

import { useState, useMemo } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Settings2,
  XCircle,
  CircleDot,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { Badge } from '@/components/ui/badge';
import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface TokenData {
  token_name: string;
  chain: string;
  symbol: string;
  first_signal_time: number;
  dog: string | null;
  transaction_amount: number;
  transaction_count: number;
  max_increase: number;
  max_price: number;
  to_zero_seconds: number;
  date: string;
  time_range: string;
}

interface SignalTableProps {
  data: TokenData[];
  selectedDate: string;
}

export function SignalTable({ data, selectedDate }: SignalTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data for the selected date
  const filteredData = useMemo(() => {
    return data.filter((item) => item.date === selectedDate);
  }, [data, selectedDate]);

  // Get unique values for filters
  const uniqueChains = useMemo(() => {
    const chains = Array.from(new Set(data.map((item) => item.chain)));
    return chains.map((chain) => ({
      label: chain,
      value: chain
    }));
  }, [data]);

  const uniqueTimeRanges = useMemo(() => {
    const timeRanges = Array.from(new Set(data.map((item) => item.time_range)));
    return timeRanges.map((time) => ({
      label: time,
      value: time
    }));
  }, [data]);

  const uniqueDogs = useMemo(() => {
    const dogs = Array.from(new Set(data.map((item) => item.dog))).filter(
      Boolean
    ) as string[];
    return [
      ...dogs.map((dog) => ({
        label: dog,
        value: dog
      })),
      { label: 'None', value: '' }
    ];
  }, [data]);

  const columns: ColumnDef<TokenData>[] = [
    {
      accessorKey: 'token_name',
      header: () => (
        <div className='text-muted-foreground px-3 py-3 text-center text-sm font-medium'>
          Token Name
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className='flex max-w-[200px] space-x-2'>
            <span className='truncate font-medium'>
              {row.getValue('token_name')}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'chain',
      header: () => (
        <div className='text-muted-foreground px-3 py-3 text-center text-sm font-medium'>
          Chain
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('chain')}</div>,
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'symbol',
      header: () => (
        <div className='text-muted-foreground px-3 py-3 text-center text-sm font-medium'>
          Symbol
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('symbol')}</div>
    },
    {
      accessorKey: 'first_signal_time',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting()}
          className='hover:bg-muted flex h-auto w-full items-center justify-center rounded-md px-3 py-3 text-center'
        >
          <span className='flex-grow text-sm font-medium'>
            First Signal Time
          </span>
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
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue('first_signal_time') as number;
        const date = new Date(timestamp * 1000);
        return <div>{date.toLocaleString()}</div>;
      },
      sortingFn: 'datetime'
    },
    {
      accessorKey: 'dog',
      header: () => (
        <div className='text-muted-foreground px-3 py-3 text-center text-sm font-medium'>
          Dog
        </div>
      ),
      cell: ({ row }) => {
        const dog = row.getValue('dog') as string | null;

        if (!dog) {
          return <div className='text-muted-foreground text-sm'>-</div>;
        }

        let badgeVariant = 'outline';
        let badgeText = dog;

        if (dog === '金狗') {
          badgeVariant = 'gold';
        } else if (dog === '银狗') {
          badgeVariant = 'silver';
        } else if (dog === '铜狗') {
          badgeVariant = 'bronze';
        }

        return (
          <Badge variant={badgeVariant as any} className='capitalize'>
            <CircleDot className='mr-1 h-3.5 w-3.5' />
            {badgeText}
          </Badge>
        );
      },
      filterFn: (row, id, value: string[]) => {
        const dogValue = row.getValue(id) as string | null;
        if (!value.length) return true;
        return value.includes(dogValue || '');
      }
    },
    {
      accessorKey: 'transaction_amount',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting()}
          className='hover:bg-muted flex h-auto w-full items-center justify-center rounded-md px-3 py-3 text-center'
        >
          <span className='flex-grow text-sm font-medium'>
            Transaction Amount
          </span>
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
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('transaction_amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
        return <div className='text-right font-medium'>{formatted}</div>;
      },
      sortingFn: 'basic'
    },
    {
      accessorKey: 'transaction_count',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting()}
          className='hover:bg-muted flex h-auto w-full items-center justify-center rounded-md px-3 py-3 text-center'
        >
          <span className='flex-grow text-sm font-medium'>
            Transaction Count
          </span>
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
      ),
      cell: ({ row }) => {
        return (
          <div className='text-right'>{row.getValue('transaction_count')}</div>
        );
      },
      sortingFn: 'basic'
    },
    {
      accessorKey: 'max_increase',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting()}
          className='hover:bg-muted flex h-auto w-full items-center justify-center rounded-md px-3 py-3 text-center'
        >
          <span className='flex-grow text-sm font-medium'>Max Increase</span>
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
      ),
      cell: ({ row }) => {
        const value = parseFloat(row.getValue('max_increase'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
        return <div className='text-right font-medium'>{formatted}</div>;
      },
      sortingFn: 'basic'
    },
    {
      accessorKey: 'max_price',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting()}
          className='hover:bg-muted flex h-auto w-full items-center justify-center rounded-md px-3 py-3 text-center'
        >
          <span className='flex-grow text-sm font-medium'>Max Price</span>
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
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('max_price'));
        const formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 6,
          maximumFractionDigits: 10
        }).format(amount);
        return <div className='text-right font-medium'>{formatted}</div>;
      },
      sortingFn: 'basic'
    },
    {
      accessorKey: 'to_zero_seconds',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting()}
          className='hover:bg-muted flex h-auto w-full items-center justify-center rounded-md px-3 py-3 text-center'
        >
          <span className='flex-grow text-sm font-medium'>To Zero Seconds</span>
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
      ),
      cell: ({ row }) => {
        const seconds = row.getValue('to_zero_seconds') as number;
        return (
          <div className='text-right'>
            {seconds > 0 ? `${seconds}s` : 'Not zeroed'}
          </div>
        );
      },
      sortingFn: 'basic'
    },
    {
      accessorKey: 'time_range',
      header: () => (
        <div className='text-muted-foreground px-3 py-3 text-center text-sm font-medium'>
          Time Range
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('time_range')}</div>,
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id));
      }
    }
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  // Get list of columns that can be hidden/shown
  const tableColumns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== 'undefined' && column.getCanHide()
        ),
    [table]
  );

  // Check if there are any active filters
  const isFiltered =
    table.getState().columnFilters.length > 0 || searchQuery.length > 0;

  // Handle resetting all filters
  const resetFilters = () => {
    table.resetColumnFilters();
    setSearchQuery('');
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-2 py-4'>
        <Input
          placeholder='Search tokens...'
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            table.getColumn('token_name')?.setFilterValue(event.target.value);
          }}
          className='max-w-sm'
        />

        {table.getColumn('chain') && (
          <DataTableFacetedFilter
            column={table.getColumn('chain')}
            title='筛选链'
            options={uniqueChains}
            multiple
          />
        )}
        {table.getColumn('time_range') && (
          <DataTableFacetedFilter
            column={table.getColumn('time_range')}
            title='筛选时间段'
            options={uniqueTimeRanges}
            multiple
          />
        )}
        {table.getColumn('dog') && (
          <DataTableFacetedFilter
            column={table.getColumn('dog')}
            title='筛选狗种类'
            options={uniqueDogs}
            multiple
          />
        )}

        {isFiltered && (
          <Button
            variant='outline'
            size='sm'
            onClick={resetFilters}
            className='h-8 border-dashed px-2 lg:px-3'
          >
            <XCircle className='mr-2 h-4 w-4' />
            Reset
          </Button>
        )}

        <div className='ml-auto'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                aria-label='Toggle columns'
                role='combobox'
                variant='outline'
                size='sm'
                className='ml-auto h-8 lg:flex'
              >
                <Settings2 className='mr-2 h-4 w-4' />
                View
                <CaretSortIcon className='ml-2 h-4 w-4 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-48 p-0'>
              <Command>
                <CommandInput placeholder='Search columns...' />
                <CommandList>
                  <CommandEmpty>No columns found.</CommandEmpty>
                  <CommandGroup>
                    {tableColumns.map((column) => (
                      <CommandItem
                        key={column.id}
                        onSelect={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                      >
                        <span className='truncate capitalize'>
                          {column.id.replace(/_/g, ' ')}
                        </span>
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            column.getIsVisible() ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className='rounded-md border'>
        <ScrollArea className='h-[600px]'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='bg-muted'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
