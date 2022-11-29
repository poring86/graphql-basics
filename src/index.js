import { createServer, createPubSub } from "@graphql-yoga/node";

import path from "path";
import fs from "fs";

import db from "./db";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import Subscription from "./resolvers/Subscription";

const resolvers = {
  Query,
  Mutation,
  Post,
  User,
  Comment,
  Subscription,
};

const pubsub = createPubSub();

const server = new createServer({
  schema: {
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
    resolvers,
  },
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log("The server is up");
});
