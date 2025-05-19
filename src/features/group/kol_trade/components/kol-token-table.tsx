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
import { ChevronDown, Settings2, ChevronRight, X, XCircle } from 'lucide-react';
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
    pageSize: 5 // Smaller default page size for the details table
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
      cell: ({ row }) => (
        <div className='text-right'>{row.getValue('buy_counts')}</div>
      )
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
        <Table>
          <TableHeader>
            {kolTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
      </div>

      <DataTablePagination table={kolTable} pageSizeOptions={[5, 10, 20, 50]} />
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
        'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-visible p-1 sm:flex-row sm:gap-8',
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
      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
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
            className='hidden size-7 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            aria-label='Go to previous page'
            variant='outline'
            size='icon'
            className='size-7'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            aria-label='Go to next page'
            variant='outline'
            size='icon'
            className='size-7'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            aria-label='Go to last page'
            variant='outline'
            size='icon'
            className='hidden size-7 lg:flex'
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
      accessorKey: 'token_address',
      header: 'Token Address',
      cell: ({ row }) => {
        const address = row.getValue('token_address') as string;
        const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        return (
          <div className='font-medium'>
            <span className='font-mono'>{shortAddress}</span>
            <span className='text-muted-foreground block text-xs'>
              {address}
            </span>
          </div>
        );
      }
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
        <div className='text-right font-medium'>
          {row.getValue('buy_sum_counts')}
        </div>
      )
    },
    {
      accessorKey: 'kols_count',
      header: 'KOLs Count',
      cell: ({ row }) => (
        <div className='text-right font-medium'>
          {row.original.kols_details.length}
        </div>
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
    <div className='space-y-4 p-6'>
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
        <ScrollArea className='h-[calc(100vh-350px)] max-h-[400px]'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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

      <CustomDataTablePagination
        table={table}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        className='mt-2 border-t pt-4'
      />
    </div>
  );
}
