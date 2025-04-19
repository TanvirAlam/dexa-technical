import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export const createApolloHandler = () => {
  return startServerAndCreateNextHandler(apolloServer, {
    context: async (req) => ({ req }),
  });
};
