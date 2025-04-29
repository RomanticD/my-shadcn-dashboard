import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LineGraphSkeleton() {
  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <Skeleton className='h-6 w-[180px]' />
          <Skeleton className='h-4 w-[250px]' />
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <div className='relative aspect-auto h-[280px] w-full'>
          {/* Create a line-like shape with evenly spaced points */}
          <div className='absolute inset-0 flex items-center'>
            <Skeleton className='h-[1px] w-full' /> {/* x-axis baseline */}
          </div>
          {/* Add the "line" effect with varying heights */}
          <div className='absolute inset-0 flex items-end justify-between'>
            {Array.from({ length: 7 }).map((_, i) => {
              // Create random heights for the line points
              const height = 20 + Math.random() * 60;
              return (
                <div
                  key={i}
                  className='flex flex-col items-center justify-end'
                  style={{ height: '100%' }}
                >
                  <Skeleton
                    className='w-2 rounded-full'
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
          <Skeleton className='absolute right-0 bottom-0 left-0 h-[1px]' />{' '}
          {/* x-axis */}
          <Skeleton className='absolute top-0 bottom-0 left-0 w-[1px]' />{' '}
          {/* y-axis */}
        </div>
      </CardContent>
    </Card>
  );
}
