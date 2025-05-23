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
  // 不同宽度的列，更加贴合实际
  const columnWidths = [
    '100px', // 第一列常常是序号或者选择框
    '180px', // 名称列通常较宽
    '140px',
    '120px',
    '160px',
    '140px',
    '120px',
    '100px'
  ];

  // 确保即使columnCount大于预设的数组长度，也能有合适的宽度
  const cellWidths = Array.from(
    { length: columnCount },
    (_, i) => columnWidths[i % columnWidths.length]
  );

  return (
    <div className={cn('flex flex-col space-y-4', className)} {...props}>
      {headerControls && (
        <div className='flex w-full items-center justify-between gap-2 pb-2'>
          <div className='flex items-center gap-3'>
            {searchBar && <Skeleton className='h-10 w-[240px]' />}
            <div className='hidden gap-2 md:flex'>
              <Skeleton className='h-9 w-[100px]' />
              <Skeleton className='h-9 w-[90px]' />
            </div>
          </div>
          <div className='ml-auto flex items-center gap-2'>
            <Skeleton className='h-9 w-[100px]' />
            <Skeleton className='h-9 w-9 rounded-md' />
          </div>
        </div>
      )}

      <Card className='bg-background overflow-hidden rounded-md border shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow className='border-b hover:bg-transparent'>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead
                  key={i}
                  className={i === 0 ? 'w-[60px]' : ''}
                  style={{ width: cellWidths[i] }}
                >
                  <div className='flex items-center gap-1'>
                    <Skeleton className='h-5 w-full max-w-[100px]' />
                    {i > 0 && i < columnCount - 1 && (
                      <div className='text-muted-foreground h-4 w-4 opacity-40'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='m7 15 5 5 5-5' />
                          <path d='m7 9 5-5 5 5' />
                        </svg>
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className='border-b hover:bg-transparent'>
                {Array.from({ length: columnCount }).map((_, j) => {
                  // 不同类型的单元格内容
                  const cellContent = () => {
                    if (j === 0)
                      return <Skeleton className='h-4 w-4 rounded-sm' />;
                    if (j === columnCount - 1)
                      return <Skeleton className='h-8 w-[70px] rounded-md' />;

                    const width =
                      Math.min(parseInt(cellWidths[j]), 150) -
                      Math.random() * 30;
                    return (
                      <Skeleton
                        className='h-4'
                        style={{ width: `${width}px` }}
                      />
                    );
                  };

                  return (
                    <TableCell key={j} className='py-3'>
                      <div className='flex items-center gap-2'>
                        {cellContent()}
                        {j === 1 && (
                          <Skeleton className='ml-1 h-4 w-4 rounded-full' />
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className='mt-2 flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-8 w-[60px]' />
          <span className='text-muted-foreground mx-1 text-xs'>of</span>
          <Skeleton className='h-8 w-[40px]' />
          <span className='text-muted-foreground mx-1 text-xs'>rows</span>
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8 rounded-md' />
          <div className='flex'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'h-8 w-8 rounded-md',
                  i === 1 ? 'bg-primary/30' : ''
                )}
              />
            ))}
          </div>
          <Skeleton className='h-8 w-8 rounded-md' />
        </div>
      </div>
    </div>
  );
}
