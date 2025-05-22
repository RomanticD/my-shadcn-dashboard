import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TokenTrendsLineChartSkeleton() {
  return (
    <Card className='@container/card w-full'>
      <CardHeader>
        <Skeleton className='h-6 w-[180px]' />
        <Skeleton className='h-4 w-[250px]' />
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <div className='relative aspect-auto h-[300px] w-full'>
          {/* Create area chart effect with gray gradient */}
          <div className='from-muted/40 to-muted/10 absolute inset-0 rounded-lg bg-gradient-to-t' />
          {/* Add multiple area-like shapes with gray gradients */}
          <div className='absolute inset-0 flex items-end justify-between'>
            {Array.from({ length: 5 }).map((_, i) => {
              // Create varying wave patterns
              const baseHeight = 30 + Math.random() * 40;
              return (
                <div
                  key={i}
                  className='flex h-full w-full items-end'
                  style={{ zIndex: 5 - i }}
                >
                  <div
                    className='from-muted/30 to-muted/5 h-full w-full bg-gradient-to-t'
                    style={{
                      height: `${baseHeight}%`,
                      opacity: 0.7 - i * 0.1
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* Coordinate axes */}
          <Skeleton className='absolute right-0 bottom-0 left-0 h-[1px]' />
          <Skeleton className='absolute top-0 bottom-0 left-0 w-[1px]' />
          <Skeleton className='absolute top-0 right-0 bottom-0 w-[1px]' />
          {/* X-axis ticks */}
          <div className='absolute right-0 bottom-0 left-0 flex justify-between px-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-2 w-[1px]' />
            ))}
          </div>
          {/* Y-axis ticks */}
          <div className='absolute top-0 bottom-0 left-0 flex flex-col justify-between py-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-[1px] w-2' />
            ))}
          </div>
          {/* Y-axis ticks (right) */}
          <div className='absolute top-0 right-0 bottom-0 flex flex-col justify-between py-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-[1px] w-2' />
            ))}
          </div>
          {/* Legend skeleton */}
          <div className='absolute right-0 bottom-[-30px] left-0 flex justify-center gap-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-3 w-3 rounded-full' />
              <Skeleton className='h-3 w-16' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-3 w-3 rounded-full' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
