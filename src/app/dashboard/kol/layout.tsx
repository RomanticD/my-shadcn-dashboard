import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KOL Trading Dashboard',
  description: 'Monitor KOL trading activities on different chains'
};

export default function KolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
