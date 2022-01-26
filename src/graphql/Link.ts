import { arg, extendType, idArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

// dummy data
let links: NexusGenObjects["Link"][] = [
  {
    id: 1,
    url: "www.google.com",
    description: "main page of google",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return links;
      },
    });
    t.field("link", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context) {
        return links.filter((link) => link.id.toString() === args.id)[0];
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

        let idCount = links.length + 1;
        const link = {
          id: idCount,
          description,
          url,
        };
        links.push(link);
        return link;
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
        const { id, url, description } = args;

        links = links.map((link) =>
          link.id.toString() === id
            ? {
                id: Number(id),
                description: description || link.description,
                url: url || link.url,
              }
            : link
        );

        return links.filter((link) => link.id.toString() === id)[0];
      },
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args, context) {
        const removedLink = links.filter(
          (link) => link.id.toString() === args.id
        )[0];

        links = links.filter((link) => link.id.toString() !== args.id);

        return removedLink;
      },
    });
  },
});
