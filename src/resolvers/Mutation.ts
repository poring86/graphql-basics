import { GraphQLYogaError } from "@graphql-yoga/node";
import { compare, hash } from "bcryptjs";

import { sign } from "jsonwebtoken";

import { User, Comment, Post } from "../types/global";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { APP_SECRET, getUserId } from "../utils";

const Mutation = {
    async createUser(
        _parent: any,
        { data }: { data: User },
        { prisma }: any,
        _info: any
    ) {
        const hashedPassword = await hash(data.password, 10);
        const user = {
            ...data,
            password: hashedPassword,
        };

        try {
            return await prisma.user.create({
                data: user,
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
        _args: any,
        { prisma, request }: any,
        _info: any
    ) {
        const userId = getUserId(request);
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
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
        { data }: { data: User },
        { prisma, request }: any,
        _info: any
    ) {
        const userId = getUserId(request);
        try {
            return await prisma.user.update({
                where: {
                    id: userId,
                },
                data,
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new GraphQLYogaError("User not found");
                }
                if (e.code === "P2002") {
                    throw new GraphQLYogaError("Email Taken");
                }
            }
        }
    },
    async createPost(
        _parent: any,
        { data }: { data: Post },
        { pubsub, prisma, request }: any,
        _info: any
    ) {
        const userId = getUserId(request);
        try {
            const post = await prisma.post.create({
                data: {
                    ...data,
                    userId,
                },
            });

            if (data.published) {
                pubsub.publish("post", {
                    post: {
                        mutation: "CREATED",
                        data: post,
                    },
                });
            }

            return post;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2003") {
                    throw new GraphQLYogaError("User not found");
                }
            }
        }
    },
    async deletePost(
        _parent: any,
        { id }: { id: string },
        { pubsub, prisma }: any,
        _info: any
    ) {
        try {
            const post = await prisma.post.delete({
                where: {
                    id,
                },
            });

            if (post.published) {
                pubsub.publish("post", {
                    post: {
                        mutation: "DELETED",
                        data: post,
                    },
                });
            }

            return post;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new GraphQLYogaError("Post not found");
                }
            }
        }
    },
    async updatePost(
        _parent: any,
        { id, data }: { id: string; data: Post },
        { pubsub, prisma }: any,
        _info: any
    ) {
        let post = await prisma.post.findUnique({
            where: {
                id,
            },
        });

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
        }

        try {
            post = await prisma.post.update({
                where: {
                    id,
                },
                data,
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new GraphQLYogaError("Post not found");
                }
            }
        }

        if (typeof data.published !== "boolean" && post.published) {
            pubsub.publish("post", {
                post: {
                    mutation: "UPDATED",
                    data: post,
                },
            });
        } else if (originalPost.published && !post.published) {
            pubsub.publish("post", {
                post: {
                    mutation: "DELETED",
                    data: originalPost,
                },
            });
        } else if (!originalPost.published && post.published) {
            pubsub.publish("post", {
                post: {
                    mutation: "CREATED",
                    data: post,
                },
            });
        } else if (originalPost.published && post.published) {
            pubsub.publish("post", {
                post: {
                    mutation: "UPDATED",
                    data: post,
                },
            });
        }

        return post;
    },
    async createComment(
        _parent: any,
        { data }: { data: any },
        { pubsub, prisma, request }: any,
        _info: any
    ) {
        const userId = getUserId(request);
        try {
            const comment = await prisma.comment.create({
                data: {
                    text: data.text,
                    userId,
                    postId: data.post,
                },
            });

            pubsub.publish(`comment ${data.post}`, {
                comment: {
                    mutation: "CREATED",
                    data: comment,
                },
            });

            return comment;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2003") {
                    throw new GraphQLYogaError("Not found");
                }
            }
        }
    },
    async deleteComment(
        _parent: any,
        { id }: { id: string },
        { pubsub, prisma }: any,
        _info: any
    ) {
        try {
            const comment = await prisma.comment.delete({
                where: {
                    id,
                },
            });
            pubsub.publish(`comment ${comment.post}`, {
                comment: {
                    mutation: "DELETED",
                    data: comment,
                },
            });

            return comment;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new GraphQLYogaError("Comment not found");
                }
            }
        }
    },
    async updateComment(
        _parent: any,
        args: { id: string; data: Comment },
        { pubsub, prisma }: any,
        _info: any
    ) {
        try {
            const comment = await prisma.comment.update({
                where: {
                    id: args.id,
                },
                data: args.data,
            });

            pubsub.publish(`comment ${comment.post}`, {
                comment: {
                    mutation: "UPDATED",
                    data: comment,
                },
            });

            return comment;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2025") {
                    throw new GraphQLYogaError("Comment not found");
                }
            }
        }
    },
    async login(_parent: any, args: any, { prisma }: any, _info: any) {
        const user = await prisma.user.findUnique({
            where: {
                email: args.email,
            },
        });

        if (!user) {
            throw new GraphQLYogaError("User not found");
        }

        const passwordValid = await compare(args.password, user.password);

        if (!passwordValid) {
            throw new GraphQLYogaError("Invalid password");
        }

        const token = sign({ userId: user.id }, APP_SECRET);

        return {
            token,
            user,
        };
    },
};

export { Mutation as default };
