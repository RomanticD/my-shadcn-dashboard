import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signal Dashboard',
  description: 'Signal page for Group1'
};

export default function SignalPage() {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <h1 className='text-3xl font-bold'>Signal</h1>
      <p className='text-muted-foreground'>
        Signal page content will be added here.
      </p>
    </div>
  );
}
