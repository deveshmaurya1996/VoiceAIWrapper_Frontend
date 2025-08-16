import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql/',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const authLink = setContext((_, { headers }) => {
  // Add any authentication headers here if needed
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        projects: {
          keyArgs: ['organizationSlug'],
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
        tasks: {
          keyArgs: ['projectId', 'organizationSlug'],
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Task: {
      fields: {
        id: { read: (id) => id },
      }
    },
    Project: {
      fields: {
        id: { read: (id) => id },
      }
    }
  },
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
