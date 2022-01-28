import { objectType, extendType, nonNull, intArg } from "nexus";
import { User } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";

export const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.nonNull.field("link", { type: "Link" });
    t.nonNull.field("user", { type: "User" });
  },
});

export const VoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("vote", {
      type: "Vote",
      args: {
        linkId: nonNull(intArg()),
        // we don't need userId as argument because it can be decoded from the Authentication header
      },
      async resolve(parent, args, context) {
        const { userId } = context;
        const { linkId } = args;

        if (!userId) {
          throw new AuthenticationError("Cannot vote without logging in");
        }

        const link = await context.prisma.link.update({
          where: {
            id: linkId,
          },
          data: {
            voters: {
             /*
                Remember! A nested 'connect' query connects a record 
                to an existing related record by specifying an ID or
                unique identifier.
                more info: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#connect 
             */
              connect: {
                id: userId,
              },
            },
          },
        });

        const user = await context.prisma.user.findUnique({
          where: { id: userId },
        });

        return {
          link,
          /*
            Remember! The typecasting (user as User) is necessary 
            as the type returned by prisma.user.findUnique is User | null, 
            whereas the type expected from the resolve function is User.
           */
          user: user as User,
        };
      },
    });
  },
});
