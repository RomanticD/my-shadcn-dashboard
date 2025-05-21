'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';
import { TokenTableToolbar } from './custom-toolbar';

interface TokenTableParams<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

export function TokenTable<TData, TValue>({
  data,
  columns
}: TokenTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  // Initialize with all columns visible by default, which prevents columns from disappearing when sorting
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageSize
      }
    },
    state: {
      columnVisibility,
      rowSelection,
      columnFilters
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  });

  return (
    <DataTable table={table}>
      <TokenTableToolbar table={table} />
    </DataTable>
  );
}
