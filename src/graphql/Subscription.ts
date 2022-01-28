import { objectType } from "nexus";
import { Link, Vote } from ".";

export const Subscription = objectType({
  name: "Subscription",
  definition(t) {
    t.field("newLink", { type: Link });
    t.field("newVote", { type: Vote });
  },
});
