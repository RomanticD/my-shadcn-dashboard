import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SimpleTableSkeletonProps extends React.ComponentProps<'div'> {
  columnCount: number;
  rowCount?: number;
  searchBar?: boolean;
  headerControls?: boolean;
  className?: string;
}

export function SimpleTableSkeleton({
  columnCount,
  rowCount = 8,
  searchBar = true,
  headerControls = true,
  className,
  ...props
}: SimpleTableSkeletonProps) {
  return (
    <div className={cn('flex flex-col space-y-4', className)} {...props}>
      {headerControls && (
        <div className='flex w-full items-center justify-between gap-2 pb-2'>
          {searchBar && <Skeleton className='h-10 w-[240px]' />}
          <div className='ml-auto flex items-center gap-2'>
            <Skeleton className='h-9 w-[100px]' />
            <Skeleton className='h-9 w-9' />
          </div>
        </div>
      )}

      <Card className='overflow-hidden'>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className='h-6 w-full' />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className='hover:bg-transparent'>
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className='h-6 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className='mt-2 flex items-center justify-between'>
        <Skeleton className='h-8 w-[180px]' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
    </div>
  );
}
