import { fakeTokens } from '@/constants/mock-token-api';
import { TokenTable } from './token-tables';
import { columns } from './token-tables/columns';

type TokenListingPageProps = {};

export default async function TokenListingPage({}: TokenListingPageProps) {
  const allTokens = await fakeTokens.getAll();
  return <TokenTable data={allTokens} columns={columns} />;
}
