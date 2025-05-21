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
  useReactTable,
  ExpandedState,
  getExpandedRowModel
} from '@tanstack/react-table';
import {
  ChevronDown,
  Settings2,
  ChevronRight,
  X,
  XCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { Copy, ExternalLink } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

interface KolDetail {
  chain: string;
  address: string;
  twitter_username: string;
  twitter_name: string;
  avatar: string;
  store_time: string;
  buy_counts: number;
}

interface TokenData {
  token_address: string;
  token_name: string;
  symbol: string;
  chain: string;
  is_signaled: boolean;
  buy_sum_counts: number;
  kols_details: KolDetail[];
}

interface KolTokenTableProps {
  data: TokenData[];
}

// Component for KOL Details
const KolDetailsTable = ({ kols }: { kols: KolDetail[] }) => {
  const [filterValue, setFilterValue] = useState('');
  const [kolSorting, setKolSorting] = useState<SortingState>([
    { id: 'buy_counts', desc: true }
  ]);
  const [kolPagination, setKolPagination] = useState({
    pageIndex: 0,
    pageSize: 10 // Increased default page size for better visibility
  });

  // Filter KOLs based on search input
  const filteredKols = useMemo(() => {
    if (!filterValue) return kols;

    return kols.filter(
      (kol) =>
        kol.twitter_name.toLowerCase().includes(filterValue.toLowerCase()) ||
        kol.twitter_username.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [kols, filterValue]);

  const kolColumns: ColumnDef<KolDetail>[] = [
    {
      id: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => {
        const avatar = row.original.avatar;
        return (
          <Avatar className='h-8 w-8'>
            <AvatarImage src={avatar} alt={row.original.twitter_name} />
            <AvatarFallback>
              {row.original.twitter_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        );
      }
    },
    {
      accessorKey: 'twitter_name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('twitter_name')}</div>
      )
    },
    {
      accessorKey: 'twitter_username',
      header: 'Username',
      cell: ({ row }) => <div>@{row.getValue('twitter_username')}</div>
    },
    {
      accessorKey: 'chain',
      header: 'Chain',
      cell: ({ row }) => <div>{row.getValue('chain')}</div>
    },
    {
      accessorKey: 'buy_counts',
      header: 'Buy Counts',
      cell: ({ row }) => <div>{row.getValue('buy_counts')}</div>
    },
    {
      accessorKey: 'store_time',
      header: 'Date',
      cell: ({ row }) => <div>{row.getValue('store_time')}</div>
    }
  ];

  const kolTable = useReactTable({
    data: filteredKols,
    columns: kolColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: kolSorting,
      pagination: kolPagination
    },
    onSortingChange: setKolSorting,
    onPaginationChange: setKolPagination,
    pageCount: Math.ceil(filteredKols.length / kolPagination.pageSize)
  });

  return (
    <div className='bg-muted/50 space-y-4 rounded-md p-4'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-semibold'>KOL Details</h4>
        <Input
          placeholder='Search KOL name or username...'
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className='max-w-xs'
        />
      </div>

      <div className='rounded-md border'>
        <ScrollArea className='h-[200px]'>
          <Table>
            <TableHeader>
              {kolTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='bg-muted'>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'p-0', // Reset TableHead padding, Button will handle it.
                        header.column.getCanSort() ? 'cursor-pointer' : ''
                      )}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant='ghost'
                          onClick={header.column.getToggleSortingHandler()}
                          className='hover:bg-muted flex h-full w-full items-center justify-center rounded-md px-3 py-3 text-center'
                        >
                          <span className='flex-grow text-sm font-medium'>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          <div className='ml-2 h-4 w-4 flex-shrink-0'>
                            {header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className='h-4 w-4' />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className='h-4 w-4' />
                            ) : (
                              <CaretSortIcon className='h-4 w-4' />
                            )}
                          </div>
                        </Button>
                      ) : (
                        <div
                          className={cn(
                            'text-muted-foreground px-3 py-3 text-center text-sm font-medium',
                            header.column.id === 'expander' && 'w-[50px]'
                          )}
                        >
                          {' '}
                          {/* Removed bg-muted rounded-md */}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {kolTable.getRowModel().rows.length ? (
                kolTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                    colSpan={kolColumns.length}
                    className='h-24 text-center'
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className='pt-2 pb-1'>
        <DataTablePagination
          table={kolTable}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
};

// Create a custom pagination component with Chinese text
function CustomDataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className
}: {
  table: any;
  pageSizeOptions?: number[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-between gap-4 overflow-visible py-2 sm:flex-row sm:gap-8',
        className
      )}
    >
      <div className='text-muted-foreground flex-1 text-sm whitespace-nowrap'>
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <>
            已选择 {table.getFilteredSelectedRowModel().rows.length} 行，共
            {table.getFilteredRowModel().rows.length} 行
          </>
        ) : (
          <>共 {table.getFilteredRowModel().rows.length} 行</>
        )}
      </div>
      <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium whitespace-nowrap'>每页行数</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[4.5rem] [&[data-size]]:h-8'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-center text-sm font-medium'>
          第 {table.getState().pagination.pageIndex + 1} 页，共{' '}
          {table.getPageCount()} 页
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            aria-label='Go to first page'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            aria-label='Go to previous page'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            aria-label='Go to next page'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            aria-label='Go to last page'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Token Address Cell Component
const TokenAddressCell = ({
  value,
  chain
}: {
  value: string;
  chain: string;
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('地址已复制', {
      description: '代币地址已复制到剪贴板'
    });
  };

  const handleOpenExternalLink = () => {
    window.open(`https://debot.ai/token/${chain}/${value}`, '_blank');
  };

  return (
    <div className='flex items-center justify-center gap-2'>
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
            <p>复制地址</p>
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
            <p>在 Debot 上查看</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// Symbol Cell Component
const SymbolCell = ({ symbol }: { symbol: string }) => {
  return (
    <div className='flex items-center justify-center'>
      <div className='h-8 w-8 overflow-hidden rounded-full'>
        <img
          src={symbol}
          alt='Token'
          className='h-full w-full object-cover'
          onError={(e) => {
            // 如果图像加载失败，显示默认图像
            (e.target as HTMLImageElement).src =
              'https://assets.coingecko.com/coins/images/16119/small/coin-blank.png';
          }}
        />
      </div>
    </div>
  );
};

export function KolTokenTable({ data }: KolTokenTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  // Get unique chains for filter
  const chainOptions = useMemo(() => {
    const chains = Array.from(new Set(data.map((item) => item.chain)));
    return chains.map((chain) => ({
      label: chain,
      value: chain
    }));
  }, [data]);

  // Get signal options for filter
  const signalOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
  ];

  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) =>
      item.kols_details.some(
        (kol) =>
          kol.twitter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kol.twitter_username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  // Reset all filters function
  const resetFilters = () => {
    setColumnFilters([]);
    setSearchQuery('');
  };

  // Check if any filters are applied
  const isFiltered = searchQuery !== '' || columnFilters.length > 0;

  const columns: ColumnDef<TokenData>[] = [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant='ghost'
          onClick={() => row.toggleExpanded()}
          className='h-6 w-6 p-0'
        >
          {row.getIsExpanded() ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>
      )
    },
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ row }) => <SymbolCell symbol={row.getValue('symbol')} />
    },
    {
      accessorKey: 'token_name',
      header: 'Token Name',
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('token_name')}</div>
      )
    },
    {
      accessorKey: 'token_address',
      header: 'Token Address',
      cell: ({ row }) => (
        <TokenAddressCell
          value={row.getValue('token_address')}
          chain={row.getValue('chain')}
        />
      )
    },
    {
      accessorKey: 'chain',
      header: 'Chain',
      cell: ({ row }) => <div>{row.getValue('chain')}</div>,
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'is_signaled',
      header: 'Signal',
      cell: ({ row }) => {
        const isSignaled = row.getValue('is_signaled') as boolean;
        return (
          <Badge variant={isSignaled ? 'success' : 'destructive'}>
            {isSignaled ? 'Yes' : 'No'}
          </Badge>
        );
      },
      filterFn: (row, id, value: string[]) => {
        const val = row.getValue(id) as boolean;
        return value.includes(String(val));
      }
    },
    {
      accessorKey: 'buy_sum_counts',
      header: 'Total Buy Counts',
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('buy_sum_counts')}</div>
      )
    },
    {
      accessorKey: 'kols_count',
      header: 'KOLs Count',
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.kols_details.length}</div>
      )
    }
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      pagination
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // Define custom page count to avoid empty pages
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize)
  });

  return (
    <div className='bg-background rounded-lg border shadow-sm'>
      <div className='space-y-4 p-4'>
        <div className='flex flex-wrap items-center gap-2 py-4'>
          <Input
            placeholder='Search by KOL name or username...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='max-w-sm'
          />

          {table.getColumn('chain') && (
            <DataTableFacetedFilter
              title='筛选链'
              options={chainOptions}
              column={table.getColumn('chain')}
              multiple
            />
          )}

          {table.getColumn('is_signaled') && (
            <DataTableFacetedFilter
              title='筛选告警'
              options={signalOptions}
              column={table.getColumn('is_signaled')}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='ml-auto h-8'>
                  <Settings2 className='mr-2 h-4 w-4' />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id.replace('_', ' ')}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='rounded-md border'>
          <ScrollArea className='h-[550px]'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className='bg-muted'>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          'p-0', // Reset TableHead padding, Button will handle it.
                          header.column.getCanSort() ? 'cursor-pointer' : ''
                        )}
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <Button
                            variant='ghost'
                            onClick={header.column.getToggleSortingHandler()}
                            className='hover:bg-muted flex h-full w-full items-center justify-center rounded-md px-3 py-3 text-center'
                          >
                            <span className='flex-grow text-sm font-medium'>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            <div className='ml-2 h-4 w-4 flex-shrink-0'>
                              {header.column.getIsSorted() === 'asc' ? (
                                <ArrowUp className='h-4 w-4' />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ArrowDown className='h-4 w-4' />
                              ) : (
                                <CaretSortIcon className='h-4 w-4' />
                              )}
                            </div>
                          </Button>
                        ) : (
                          <div
                            className={cn(
                              'text-muted-foreground px-3 py-3 text-center text-sm font-medium',
                              header.column.id === 'expander' && 'w-[50px]'
                            )}
                          >
                            {' '}
                            {/* Removed bg-muted rounded-md */}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <>
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow>
                          <TableCell colSpan={columns.length} className='p-0'>
                            <KolDetailsTable kols={row.original.kols_details} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <div className='mt-4 pt-2'>
          <CustomDataTablePagination
            table={table}
            pageSizeOptions={[5, 10, 20, 50, 100]}
          />
        </div>
      </div>
    </div>
  );
}
