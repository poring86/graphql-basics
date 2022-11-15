import { createServer } from "@graphql-yoga/node";

const posts = [
  {
    id: "1",
    title: "Post 1",
    body: "body 1",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Post 2",
    body: "body 2",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "Post 3",
    body: "body 3",
    published: true,
    author: "1",
  },
  {
    id: "4",
    title: "Post 4",
    body: "body 4",
    published: true,
    author: "2",
  },
];

const users = [
  {
    id: "1",
    name: "Matheus",
    email: "matheus@test.com",
    age: 20,
  },
  {
    id: "2",
    name: "Lino",
    email: "lino@test.com",
    age: 21,
  },
  {
    id: "3",
    name: "Ferreira",
    email: "ferreira@test.com",
    age: 22,
  },
];

const typeDefs = `
    type Query{
      users(query: String): [User!]!
      posts(query: String): [Post!]!
      greeting(name: String, position: String): String!
      add(numbers: [Float!]!): Float!
      grades: [Int!]!
      me: User!
      post: Post!
    }

    type User{
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
    }

    type Post{
      id: ID!
      title: String!
      body: String!
      publisher: String!
      author: User!
    }
`;

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello, ${args.name}! You are my favorite ${args.position}`;
      } else {
        return "Hello!";
      }
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
    add(parent, args, ctx, info) {
      console.log("args", args.numbers);
      if (args.numbers.length === 0) {
        return 0;
      }

      const value = args.numbers.reduce((accumulator, currentValue) => {
        console.log("accumulator", accumulator);

        console.log("currentValue", currentValue);

        return accumulator + currentValue;
      });
      console.log("value", value);
      return value;
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com",
        age: 28,
      };
    },
    post() {
      return {
        id: "092",
        title: "GraphQL 101",
        body: "",
        published: false,
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
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
