import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import { Context } from "apollo-server-core";
import express from "express";
import http from "http";

import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

import { schema } from "./schema";
import { context } from "./context";
import { GraphQLSchema } from "graphql";

async function startApolloServer(schema: GraphQLSchema, context: Context) {
  const app = express();
  const httpServer = http.createServer(app);

  // This is our server for subscriptions
  const subscriptionServer = SubscriptionServer.create(
    {
      // Our schema
      schema,
      // Imported from `graphql`
      execute,
      subscribe
    },
    {
      // Our httpserver
      server: httpServer,
      // Pass a different path here if your ApolloServer serves at
      // a different path.
      path: "/",
    }
  );

  const server = new ApolloServer({
    schema,
    context,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`Server is ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(schema, context);
