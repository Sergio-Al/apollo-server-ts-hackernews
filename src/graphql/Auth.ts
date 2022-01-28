import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { expiresInValue } from "../utils/auth";
import { AuthenticationError } from "apollo-server";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { email, name } = args;
        const password = await bcrypt.hash(args.password, 10);
        const user = await context.prisma.user.create({
          data: { email, name, password },
        });

        // creates a new token
        const token = jwt.sign({ userId: user.id }, context.secret, {
          expiresIn: expiresInValue,
        });

        return {
          token,
          user,
        };
      },
    });
    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const user = await context.prisma.user.findUnique({
          where: { email: args.email },
        });

        if (!user) {
          throw new Error("No such user found");
        }

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new AuthenticationError("Invalid password");
        }

        // creates a new token
        const token = jwt.sign({ userId: user.id }, context.secret, {
          expiresIn: expiresInValue,
        });

        return { token, user };
      },
    });
  },
});
