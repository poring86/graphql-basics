import { createServer, createPubSub } from "@graphql-yoga/node";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";

import path from "path";
import fs from "fs";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import Subscription from "./resolvers/Subscription";

import { PrismaClient } from "@prisma/client";
import permissions from "./permissions";
const prisma = new PrismaClient();
const pubsub = createPubSub();

const resolvers = {
    Query,
    Mutation,
    Post,
    User,
    Comment,
    Subscription,
};

const typeDefs = fs.readFileSync(
    path.join(__dirname, "schema.graphql"),
    "utf-8"
);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const logInput = async (
    resolve: any,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
    const result = await resolve(parent, args, context, info);
    return result;
};

const schemaWithMiddleware = applyMiddleware(schema, permissions);

const server = createServer({
    schema: schemaWithMiddleware,
    context: {
        pubsub,
        prisma,
    },
});

server.start();
