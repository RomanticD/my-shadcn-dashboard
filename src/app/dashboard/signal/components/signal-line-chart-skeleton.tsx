import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SignalLineChartSkeleton() {
  return (
    <Card className='@container/card'>
      <CardHeader className='space-y-2'>
        <Skeleton className='h-6 w-[180px]' />
        <Skeleton className='h-4 w-[250px]' />
      </CardHeader>
      <CardContent className='px-2 pt-4 pb-6 sm:px-6 sm:pt-6'>
        <div className='relative aspect-auto h-[250px] w-full'>
          {/* 背景 */}
          <div className='from-muted/20 absolute inset-0 rounded-lg bg-gradient-to-t to-transparent' />

          {/* 图表网格 */}
          <div className='absolute inset-0 flex flex-col justify-between px-6 py-8'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='bg-muted/20 h-[1px] w-full' />
            ))}
          </div>

          {/* 坐标轴 */}
          <div className='bg-muted/40 absolute right-6 bottom-8 left-6 h-[1px]' />
          <div className='bg-muted/40 absolute top-8 bottom-8 left-6 w-[1px]' />

          {/* 图表线条 */}
          <div className='absolute top-8 right-6 bottom-8 left-6'>
            <svg width='100%' height='100%' className='overflow-visible'>
              <path
                d={`M0,${20 + Math.random() * 30} 
                   C${50 + Math.random() * 20},${10 + Math.random() * 20} 
                    ${100 + Math.random() * 30},${60 + Math.random() * 20} 
                    ${150 + Math.random() * 40},${30 + Math.random() * 30} 
                    ${200 + Math.random() * 50},${50 + Math.random() * 20}
                    ${250 + Math.random() * 40},${20 + Math.random() * 40}
                    ${300 + Math.random() * 50},${40 + Math.random() * 40}
                    ${350 + Math.random() * 40},${15 + Math.random() * 25}`}
                className='stroke-muted-foreground/30 fill-none stroke-2'
              />
              <path
                d={`M0,${50 + Math.random() * 30} 
                   C${40 + Math.random() * 30},${70 + Math.random() * 20} 
                    ${90 + Math.random() * 20},${40 + Math.random() * 30} 
                    ${140 + Math.random() * 30},${60 + Math.random() * 20} 
                    ${200 + Math.random() * 30},${30 + Math.random() * 40}
                    ${260 + Math.random() * 40},${50 + Math.random() * 30}
                    ${320 + Math.random() * 30},${40 + Math.random() * 20}
                    ${380 + Math.random() * 20},${55 + Math.random() * 35}`}
                className='stroke-muted-foreground/20 fill-none stroke-2'
              />
            </svg>
          </div>

          {/* X轴刻度 */}
          <div className='absolute right-6 bottom-4 left-6 flex justify-between'>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className='flex flex-col items-center'>
                <div className='bg-muted/40 h-2 w-[1px]' />
                <Skeleton className='mt-1 h-3 w-10' />
              </div>
            ))}
          </div>

          {/* Y轴刻度 */}
          <div className='absolute top-8 bottom-8 left-2 flex flex-col justify-between'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex items-center'>
                <Skeleton className='h-3 w-8' />
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className='absolute right-0 bottom-[-24px] left-0 flex justify-center gap-6'>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-blue-500/40' />
              <Skeleton className='h-3 w-16' />
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-amber-500/40' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
