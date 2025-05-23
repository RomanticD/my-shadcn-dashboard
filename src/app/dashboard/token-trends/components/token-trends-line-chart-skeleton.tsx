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
      <CardHeader className='space-y-2'>
        <Skeleton className='h-6 w-[180px]' />
        <Skeleton className='h-4 w-[250px]' />
      </CardHeader>
      <CardContent className='px-2 pt-4 pb-6 sm:px-6 sm:pt-6'>
        <div className='relative aspect-auto h-[300px] w-full'>
          {/* 背景 */}
          <div className='from-muted/20 absolute inset-0 rounded-lg bg-gradient-to-t to-transparent' />

          {/* 图表网格 */}
          <div className='absolute inset-0 flex flex-col justify-between px-6 py-8'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='bg-muted/20 h-[1px] w-full' />
            ))}
          </div>

          {/* 坐标轴 */}
          <div className='bg-muted/40 absolute right-6 bottom-8 left-6 h-[1px]' />
          <div className='bg-muted/40 absolute top-8 bottom-8 left-6 w-[1px]' />
          <div className='bg-muted/40 absolute top-8 right-6 bottom-8 w-[1px]' />

          {/* 图表线条 */}
          <div className='absolute top-8 right-6 bottom-8 left-6'>
            <svg width='100%' height='100%' className='overflow-visible'>
              {/* 第一条线 - 左Y轴 */}
              <path
                d={`M0,${30 + Math.random() * 40} 
                   C${50 + Math.random() * 20},${50 + Math.random() * 30} 
                    ${100 + Math.random() * 30},${20 + Math.random() * 30} 
                    ${150 + Math.random() * 40},${60 + Math.random() * 30} 
                    ${200 + Math.random() * 50},${40 + Math.random() * 30}
                    ${250 + Math.random() * 40},${50 + Math.random() * 30}
                    ${300 + Math.random() * 50},${20 + Math.random() * 20}
                    ${350 + Math.random() * 40},${40 + Math.random() * 30}`}
                className='fill-none stroke-blue-500/40 stroke-2'
              />

              {/* 第二条线 - 右Y轴 */}
              <path
                d={`M0,${60 + Math.random() * 30} 
                   C${40 + Math.random() * 30},${100 + Math.random() * 20} 
                    ${90 + Math.random() * 20},${70 + Math.random() * 30} 
                    ${140 + Math.random() * 30},${90 + Math.random() * 20} 
                    ${200 + Math.random() * 30},${60 + Math.random() * 30}
                    ${260 + Math.random() * 40},${80 + Math.random() * 30}
                    ${320 + Math.random() * 30},${50 + Math.random() * 30}
                    ${380 + Math.random() * 20},${70 + Math.random() * 20}`}
                className='fill-none stroke-amber-500/40 stroke-2'
              />
            </svg>
          </div>

          {/* X轴刻度 */}
          <div className='absolute right-6 bottom-3 left-6 flex justify-between'>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className='flex flex-col items-center'>
                <div className='bg-muted/40 h-2 w-[1px]' />
                <Skeleton className='mt-1 h-3 w-12' />
              </div>
            ))}
          </div>

          {/* 左Y轴刻度 */}
          <div className='absolute top-8 bottom-8 left-2 flex flex-col justify-between'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center'>
                <Skeleton className='h-3 w-8' />
              </div>
            ))}
          </div>

          {/* 右Y轴刻度 */}
          <div className='absolute top-8 right-2 bottom-8 flex flex-col justify-between'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center'>
                <Skeleton className='h-3 w-8' />
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className='absolute right-0 bottom-[-30px] left-0 flex justify-center gap-6'>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-blue-500/40' />
              <Skeleton className='h-3 w-20' />
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full bg-amber-500/40' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
