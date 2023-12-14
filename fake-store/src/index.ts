import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers.js';
import { ProductDataSource, CartDataSource, UserDataSource } from './datasources.js';

interface ContextValue {
  dataSources: {
    cartAPI: CartDataSource,
    productAPI: ProductDataSource,
    userAPI: UserDataSource
  };
}

// we must convert the file Buffer to a UTF-8 string
const typeDefs = readFileSync('schema.graphql', 'utf8');

const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers
  });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async({req,res}) => {
    console.log(req);
    return {
      dataSources: {
        cartAPI: new CartDataSource(),
        productAPI: new ProductDataSource(),
        userAPI: new UserDataSource(),
      },
    };

  }
});
  
console.log(`🚀  Server ready at: ${url}`);