import "cross-fetch/polyfill";
import { GraphQLClient, gql } from "graphql-request";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");

beforeEach(async () => {
    await prisma.user.deleteMany();

    const data: any = {
        name: "Elsa Prisma",
        email: "elsa@prisma.io",
        password: "23423423423423",
        posts: {
            create: [
                {
                    title: "Include this post!",
                    body: "Body exaple",
                    published: true,
                },
                {
                    title: "Include this post 2!",
                    body: "Body exaple 2",
                    published: true,
                },
            ],
        },
    };
    await prisma.user.create({
        data: {
            ...data,
        },
    });
});

test("Should create a new user", async () => {
    const mutation = gql`
        mutation {
            createUser(
                data: {
                    name: "Test"
                    email: "test@test.com"
                    password: "1234567"
                }
            ) {
                token
                user {
                    id
                    name
                }
            }
        }
    `;

    const response = await client.request(mutation);

    const id = response.createUser.user.id;

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    expect(Boolean(user)).toBe(true);
    expect(user?.name).toBe("Test");
});

test("Should show published posts", async () => {
    const query = gql`
        query {
            posts {
                id
            }
        }
    `;

    const response = await client.request(query);

    expect(response.posts.length).toBeGreaterThan(0);
});
