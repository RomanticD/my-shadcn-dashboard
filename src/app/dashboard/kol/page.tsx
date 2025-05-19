import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KOL Dashboard',
  description: 'KOL page for Group1'
};

export default function KolPage() {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <h1 className='text-3xl font-bold'>KOL</h1>
      <p className='text-muted-foreground'>
        KOL page content will be added here.
      </p>
    </div>
  );
}
