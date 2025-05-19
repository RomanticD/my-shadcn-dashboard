import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signal Dashboard',
  description: 'Signal page for monitoring platform signals'
};

export default function SignalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
