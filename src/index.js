import { createServer } from "@graphql-yoga/node";

const typeDefs = `
    type Query{
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

const resolvers = {
  Query: {
    hello() {
      return "This is my first query";
    },
    name() {
      return "Matheus Lino";
    },
    location() {
      return "Campo Grande";
    },
    bio() {
      return "I am a software developer";
    },
  },
};

const server = new createServer({
  schema: {
    typeDefs,
    resolvers,
  },
});

server.start(() => {
  console.log("The server is up");
});
