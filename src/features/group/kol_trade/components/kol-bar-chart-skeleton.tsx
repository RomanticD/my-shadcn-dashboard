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
      <CardHeader className='space-y-2'>
        <Skeleton className='h-6 w-[180px]' />
        <Skeleton className='h-4 w-[250px]' />
      </CardHeader>
      <CardContent className='px-2 pt-4 pb-6 sm:px-6 sm:pt-6'>
        <div className='relative aspect-auto h-[250px] w-full'>
          {/* 背景 */}
          <div className='from-muted/10 absolute inset-0 rounded-lg bg-gradient-to-t to-transparent' />

          {/* 图表网格 - 水平线 */}
          <div className='absolute inset-x-0 top-8 bottom-16 flex flex-col justify-between px-6'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='bg-muted/20 h-[1px] w-full' />
            ))}
          </div>

          {/* 坐标轴 */}
          <div className='bg-muted/40 absolute right-6 bottom-16 left-6 h-[1px]' />
          <div className='bg-muted/40 absolute top-8 bottom-16 left-6 w-[1px]' />

          {/* 柱状图 */}
          <div className='absolute inset-x-6 top-8 bottom-16 flex items-end justify-around'>
            {Array.from({ length: 6 }).map((_, i) => {
              // 创建不同高度的柱子
              const height = 20 + Math.random() * 70;
              return (
                <div key={i} className='flex flex-col items-center'>
                  {/* 柱子 */}
                  <div
                    className='w-10 rounded-t-sm bg-purple-500/30'
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* X轴标签 */}
          <div className='absolute right-6 bottom-1 left-6 flex justify-around'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='flex w-14 flex-col items-center'>
                <Skeleton className='h-3 w-12 origin-left rotate-[-45deg] transform' />
              </div>
            ))}
          </div>

          {/* Y轴刻度 */}
          <div className='absolute top-8 bottom-16 left-1 flex flex-col justify-between'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex items-center'>
                <Skeleton className='h-3 w-8' />
              </div>
            ))}
          </div>

          {/* Y轴标题 */}
          <div className='absolute top-1/2 left-[-14px] -translate-y-1/2 rotate-[-90deg] transform'>
            <Skeleton className='h-4 w-24' />
          </div>

          {/* 图例 */}
          <div className='absolute right-0 bottom-[-4px] left-0 flex justify-center'>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-sm bg-purple-500/40' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
