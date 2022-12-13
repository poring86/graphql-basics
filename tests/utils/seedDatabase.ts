import { PrismaClient } from "@prisma/client";
import { gql, GraphQLClient } from "graphql-request";
import { CreateUserResponse, PostType } from "../../src/types/global";

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");
const prisma = new PrismaClient();

let userOne: CreateUserResponse;
let post1: PostType;
let post2: PostType;

const seedDatabase = async () => {
    await prisma.user.deleteMany();

    const mutationUser = gql`
        mutation {
            createUser(
                data: {
                    name: "Elsa Prisma"
                    email: "elsa@prisma.io"
                    password: "12345678"
                }
            ) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `;

    const responseUser = await client.request(mutationUser);

    userOne = responseUser.createUser;

    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const mutationPost1 = gql`
        mutation {
            createPost(
                data: {
                    title: "Prisma tutorial"
                    body: "How to use prisma"
                    published: true
                }
            ) {
                id
                title
                body
                published
            }
        }
    `;

    post1 = await (await client.request(mutationPost1)).createPost;

    const mutationPost2 = gql`
        mutation {
            createPost(
                data: {
                    title: "Graphql tutorial"
                    body: "How to use graphql"
                    published: false
                }
            ) {
                id
                title
                body
                published
            }
        }
    `;

    post2 = await (await client.request(mutationPost1)).createPost;
};

export { seedDatabase as default, userOne, post1, post2 };
