import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from "graphql-scalars";

/*
    'asNexusMethod' allows you to expose a custom scalar as a Nexus type. 
    It takes two arguments: A custom scalar and the name for the Nexus type. 
*/
export const GQLDate = asNexusMethod(GraphQLDateTime, "dateTime");
