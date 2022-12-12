import "cross-fetch/polyfill";
import { GraphQLClient, gql } from "graphql-request";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");

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

    await prisma.user.deleteMany();
});
