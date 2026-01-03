/**
 * GraphQL client for fetching souls and wizards data from Hasura using Apollo Client
 */

import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";

export interface WizardGraphQLResponse {
  name: string;
  prop?: string;
  rune?: string;
  head?: string;
  familiar?: string;
  body?: string;
  background?: string;
  token?: {
    tokenId?: string;
  };
}

export interface SoulGraphQLResponse {
  name: string;
  prop?: string;
  rune?: string;
  image?: string;
  head?: string;
  familiar?: string;
  burnIndex?: number;
  body?: string;
  background?: string;
  token?: {
    tokenId?: string;
  };
  transmutedFromToken?: {
    wizard?: WizardGraphQLResponse;
  };
}

export interface WizardsAndSoulsResponse {
  Soul: SoulGraphQLResponse[];
}

// Create Apollo Client instance for server-side use
const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.FRWC_GRAPHQL_URL,
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only", // Always fetch fresh data
    },
  },
});

const ALL_WIZARDS_AND_SOULS_QUERY = gql`
  query AllWizardsAndSoulsQuery {
    Soul {
      background
      body
      burnIndex
      familiar
      head
      name
      prop
      rune
      token {
        tokenId
      }
      transmutedFromToken {
        wizard {
          background
          body
          familiar
          head
          name
          prop
          rune
          token {
            tokenId
          }
        }
      }
    }
  }
`;

/**
 * Fetch all wizards and souls from the GraphQL endpoint using Apollo Client in a single query
 * The query uses GraphQL relationships to include wizard data with each soul
 */
export async function fetchAllWizardsAndSouls(): Promise<WizardsAndSoulsResponse> {
  try {
    const { data } = await apolloClient.query<WizardsAndSoulsResponse>({
      query: ALL_WIZARDS_AND_SOULS_QUERY,
    });

    if (data?.Soul) {
      return data;
    }

    throw new Error("Invalid GraphQL response structure");
  } catch (error) {
    console.error("Error fetching wizards and souls from GraphQL:", error);
    throw error;
  }
}

