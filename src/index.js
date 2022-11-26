import { createServer } from "@graphql-yoga/node";
import { v4 as uuidv4 } from "uuid";

let comments = [
  {
    id: "1",
    text: "Comment",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text: "Comment",
    author: "1",
    post: "1",
  },
  {
    id: "3",
    text: "Comment",
    author: "1",
    post: "1",
  },
  {
    id: "4",
    text: "Comment",
    author: "1",
    post: "1",
  },
];

let posts = [
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

let users = [
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
      comments: [Comment!]!
    }

    type Mutation{
      createUser(data: CreateUserInput): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput): Post!
      deletePost(id: ID!): Post!
      createComment(data: CreateCommentInput): Comment!
      deleteComment(id: ID!): Comment!
    }

    input CreateUserInput{
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput{
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput{
      text: String! 
      author: ID! 
      post: ID!
    }

    type User{
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment]
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
  }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
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
    comments(parent, args, ctx, info) {
      return comments;
    },
    add(parent, args, ctx, info) {
      console.log("args", args.numbers);
      if (args.numbers.length === 0) {
        return 0;
      }

      const value = args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });

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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailToken = users.some((user) => {
        return user.email === args.data.email;
      });

      if (emailToken) {
        throw new Error("Email taken");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          return (comments = comments.filter(
            (comment) => comment.post !== post.id
          ));
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUser[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found");
      }
      const post = {
        id: uuidv4(),
        ...args.data,
      };
      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      const deletedPost = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id);

      dereturnletedPost[0];
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found");
      }

      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!postExists) {
        throw new Error("Comment not found");
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }

      const deletedComment = comments.splice(commentIndex, 1);

      comments = comments.filter((comment) => comment.id !== args.id);

      return deletedComment[0];
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
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
