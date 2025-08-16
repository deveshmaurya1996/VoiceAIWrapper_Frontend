'use client';

import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo-client';
import App from './components/App';

export default function Home() {
  // For demo purposes, using a default organization slug
  // In a real app, this would come from authentication or routing
  const defaultOrganizationSlug = 'supafunnel';

  return (
    <ApolloProvider client={client}>
      <App organizationSlug={defaultOrganizationSlug} />
    </ApolloProvider>
  );
}
