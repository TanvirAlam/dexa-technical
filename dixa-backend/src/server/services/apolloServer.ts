import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../graphql/schema';
import { resolvers } from '../graphql/resolvers';

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export const createApolloHandler = () => {
  return startServerAndCreateNextHandler(apolloServer, {
    context: async (req) => ({ req }),
  });
};
