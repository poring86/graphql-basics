import { v4 as uuidv4 } from "uuid";
import { GraphQLYogaError } from "@graphql-yoga/node";

import { User, Comment, Post } from "../types/global";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const Mutation = {
  async createUser(
    _parent: any,
    args: { data: User },
    { prisma }: any,
    _info: any
  ) {
    try {
      await prisma.user.create({
        data: {
          ...args.data,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new GraphQLYogaError("Email Taken");
        }
      }
    }
  },
  async deleteUser(
    _parent: any,
    args: { id: string },
    { prisma }: any,
    _info: any
  ) {
    try {
      return await prisma.user.delete({
        where: {
          id: args.id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          throw new GraphQLYogaError("User not found");
        }
      }
    }
  },
  async updateUser(
    _parent: any,
    args: { id: string; data: User },
    { db, prisma }: any,
    _info: any
  ) {
    const { id, data } = args;

    const user = await prisma.user.count({
      where: {
        id: id,
      },
    });

    if (user === 0) {
      throw new GraphQLYogaError("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = await prisma.user.count({
        where: {
          email: args.data.email,
        },
      });

      if (emailTaken > 0) {
        throw new GraphQLYogaError("Email Taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return await prisma.user.update({
      where: {
        id: id,
      },
      data: user,
    });
  },
  createPost(
    _parent: any,
    args: { data: { author: any; published: any } },
    { db, pubsub }: any,
    _info: any
  ) {
    const userExists = db.users.some(
      (user: User) => user.id === args.data.author
    );

    if (!userExists) {
      throw new GraphQLYogaError("User not found");
    }
    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(
    _parent: any,
    args: { id: string },
    { db, pubsub }: any,
    _info: any
  ) {
    const postIndex = db.posts.findIndex((post: Post) => post.id === args.id);

    if (postIndex === -1) {
      throw new GraphQLYogaError("Post not found");
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter(
      (comment: Comment) => comment.post !== args.id
    );

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },
  updatePost(
    _parent: any,
    args: { id: string; data: Post },
    { db, pubsub }: any,
    _info: any
  ) {
    const { id, data } = args;
    const post = db.posts.find((post: Post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new GraphQLYogaError("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      } else if (originalPost.published && post.published) {
        // updated
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      // updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  createComment(
    _parent: any,
    args: { data: any },
    { db, pubsub }: any,
    _info: any
  ) {
    const userExists = db.users.some(
      (user: User) => user.id === args.data.author
    );

    if (!userExists) {
      throw new GraphQLYogaError("User not found");
    }

    const postExists = db.posts.some(
      (post: Post) => post.id === args.data.post && post.published
    );

    if (!postExists) {
      throw new GraphQLYogaError("Comment not found");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  deleteComment(
    _parent: any,
    args: { id: string },
    { db, pubsub }: any,
    _info: any
  ) {
    const commentIndex = db.comments.findIndex(
      (comment: Comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new GraphQLYogaError("Comment not found");
    }

    const [comment] = db.comments.splice(commentIndex, 1);

    db.comments = db.comments.filter(
      (comment: Comment) => comment.id !== args.id
    );

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "DELETED",
        data: comment,
      },
    });

    return comment;
  },
  updateComment(
    _parent: any,
    args: { id: string; data: Comment },
    { db, pubsub }: any,
    _info: any
  ) {
    const { id, data } = args;
    const comment = db.comments.find((comment: Comment) => comment.id === id);

    if (!comment) {
      throw new GraphQLYogaError("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
