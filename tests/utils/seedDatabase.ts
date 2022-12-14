import { PrismaClient } from "@prisma/client";
import { GraphQLClient } from "graphql-request";
import {
    CreateUserInput,
    CreateUserResponse,
    PostType,
} from "../../src/types/global";
import { generateToken, hashedPassword } from "../../src/utils";

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");
const prisma = new PrismaClient();

let userOne: CreateUserResponse = {
    user: undefined,
    token: undefined,
};
let userTwo: CreateUserResponse = {
    user: undefined,
    token: undefined,
};
let post1: PostType;
let post2: PostType;
let comment1: any;
let comment2: any;

const seedDatabase = async () => {
    await prisma.user.deleteMany();

    const userInputOne: CreateUserInput = {
        name: "Elsa Prisma",
        email: "elsa@prisma.io",
        password: await hashedPassword("12345678"),
    };
    userOne.user = await prisma.user.create({
        data: userInputOne,
    });
    userOne.token = generateToken(userOne.user.id);

    const userInputTwo: CreateUserInput = {
        name: "John Graphql",
        email: "john@graphql.io",
        password: await hashedPassword("12345678"),
    };
    userTwo.user = await prisma.user.create({
        data: userInputTwo,
    });
    userTwo.token = generateToken(userTwo.user.id);

    const postInputOne: any = {
        title: "Prisma tutorial",
        body: "How to use prisma",
        published: true,
        userId: userOne.user.id,
    };
    post1 = await prisma.post.create({
        data: postInputOne,
    });

    const postInputTwo: any = {
        title: "Graphql tutorial",
        body: "How to use graphql",
        published: true,
        userId: userOne.user.id,
    };
    post2 = await prisma.post.create({
        data: postInputTwo,
    });

    const commentInputOne: any = {
        text: "Comment 1",
        userId: userOne.user.id,
        postId: post1.id,
    };
    comment1 = await prisma.comment.create({
        data: commentInputOne,
    });

    const commentInputTwo: any = {
        text: "Comment 1",
        userId: userTwo.user.id,
        postId: post1.id,
    };
    comment2 = await prisma.comment.create({
        data: commentInputTwo,
    });
};

export { seedDatabase as default, userOne, post1, post2, comment1, comment2 };
