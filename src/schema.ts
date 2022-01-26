import { makeSchema } from "nexus"
import { join } from "path"

export const schema = makeSchema({
  types: [],
  outputs: {
    schema: join(__dirname, "..", "schema.graphql"),
    typegen: join(__dirname, "..", "nexus-typegen.ts")
  },
})
