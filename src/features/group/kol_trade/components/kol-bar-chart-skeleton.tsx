import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function KolBarChartSkeleton() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <Skeleton className='h-6 w-[180px]' />
        <Skeleton className='h-4 w-[250px]' />
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <div className='relative aspect-auto h-[250px] w-full'>
          {/* Create skeleton bars */}
          <div className='absolute inset-x-0 top-10 bottom-8 flex items-end justify-between px-6'>
            {Array.from({ length: 6 }).map((_, i) => {
              // Create varying heights for bars
              const height = 20 + Math.random() * 60;
              return (
                <div
                  key={i}
                  className='flex h-full flex-col items-center justify-end'
                >
                  <Skeleton
                    className='w-5 rounded-t-sm'
                    style={{ height: `${height}%` }}
                  />
                  <Skeleton className='mt-2 h-2 w-12 origin-left rotate-[-45deg] transform' />
                </div>
              );
            })}
          </div>
          {/* Coordinate axes */}
          <Skeleton className='absolute right-0 bottom-8 left-0 h-[1px]' />
          <Skeleton className='absolute top-10 bottom-8 left-0 w-[1px]' />
          {/* Y-axis ticks */}
          <div className='absolute top-10 bottom-8 left-0 flex flex-col justify-between py-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-[1px] w-2' />
            ))}
          </div>
          {/* Y-axis label */}
          <div className='absolute top-1/2 left-4 -translate-y-1/2 rotate-[-90deg] transform'>
            <Skeleton className='h-3 w-16' />
          </div>
          {/* Legend skeleton */}
          <div className='absolute right-0 bottom-[-20px] left-0 flex justify-center'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-3 w-3 rounded-sm' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
