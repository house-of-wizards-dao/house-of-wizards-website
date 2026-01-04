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

export interface WarriorGraphQLResponse {
  name: string;
  forgedWith: string;
  head?: string;
  rune?: string;
  shield?: string;
  weapon?: string;
  companion?: string;
  body?: string;
  background?: string;
  token?: {
    tokenId?: string;
  };
  updatedAt?: string;
}

export interface WarriorsWithForgedWeaponResponse {
  Warrior: WarriorGraphQLResponse[];
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

const WARRIORS_WITH_FORGED_WEAPON_QUERY = gql`
  query WarriorsWithForgedWeaponQuery {
    Warrior(
      where: {forgedWith: {_neq: "null"}}
      order_by: {updatedAt: desc}
    ) {
      forgedWith
      head
      name
      rune
      shield
      weapon
      companion
      body
      background
      token {
        tokenId
      }
      updatedAt
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

/**
 * Fetch all warriors with forged weapons from the GraphQL endpoint
 */
export async function fetchWarriorsWithForgedWeapon(): Promise<WarriorsWithForgedWeaponResponse> {
  try {
    const { data } = await apolloClient.query<WarriorsWithForgedWeaponResponse>({
      query: WARRIORS_WITH_FORGED_WEAPON_QUERY,
    });

    if (data?.Warrior) {
      return data;
    }

    throw new Error("Invalid GraphQL response structure");
  } catch (error) {
    console.error("Error fetching warriors with forged weapons from GraphQL:", error);
    throw error;
  }
}

