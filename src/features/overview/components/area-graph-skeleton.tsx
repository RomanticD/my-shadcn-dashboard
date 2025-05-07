import {
  Card,
  CardContent,
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AreaGraphSkeleton() {
  return (
    <Card className='@container/card'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0 py-5 sm:py-6'>
          <Skeleton className='h-6 w-[180px]' />
          <Skeleton className='h-4 w-[250px]' />
        </div>
        <div className='flex border-t p-4 sm:border-t-0 sm:border-l'>
          <Skeleton className='h-10 w-[180px]' />
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <div className='relative aspect-auto h-[250px] w-full'>
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
          <Skeleton className='absolute right-0 bottom-0 left-0 h-[1px]' />{' '}
          {/* x-axis */}
          <Skeleton className='absolute top-0 bottom-0 left-0 w-[1px]' />{' '}
          {/* y-axis */}
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
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[220px]' />
            <Skeleton className='h-3 w-[180px]' />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
