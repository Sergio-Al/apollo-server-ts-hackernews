import { extendType, idArg, nonNull, objectType, stringArg } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt");
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany();
      },
    });
    t.field("link", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context) {
        return context.prisma.link.findUnique({
          where: {
            id: Number(args.id),
          },
        });
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: {
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

        return newLink;
      },
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
        url: stringArg(),
        description: stringArg(),
      },
      resolve(parent, args, context) {
        const updatedLink = {
          id: Number(args.id),
          url: args.url,
          description: args.description,
        };
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const newLink = context.prisma.link.update({
          where: {
            id: Number(args.id),
          },
          // we do not always need to update all fields
          // if a field is null; Prisma will not update it.
          // @ts-ignore
          data: { ...updatedLink },
        });

        return newLink;
      },
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context) {
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const removedLink = context.prisma.link.delete({
          where: {
            id: Number(args.id),
          },
        });

        return removedLink;
      },
    });
  },
});
