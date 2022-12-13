import "cross-fetch/polyfill";
import { GraphQLClient, gql } from "graphql-request";
import { PrismaClient } from "@prisma/client";
import seedDatabase from "./utils/seedDatabase";
import { userOne } from "./utils/seedDatabase";

const prisma = new PrismaClient();

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");

beforeEach(seedDatabase);

test("Should create a new user", async () => {
    const mutation = gql`
        mutation {
            createUser(
                data: {
                    name: "Test"
                    email: "test@test.com"
                    password: "12345678"
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

test("Should not login with bad credentials", async () => {
    const login = gql`
        mutation {
            login(email: "invalid@invalid.com", password: "invalid") {
                token
                user {
                    id
                }
            }
        }
    `;

    await expect(client.request(login)).rejects.toThrow();
});

test("Should not signup user with short password", async () => {
    const mutation = gql`
        mutation {
            createUser(
                data: {
                    name: "Matt"
                    email: "matt@example.com"
                    password: "pass"
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

    await expect(client.request(mutation)).rejects.toThrow();
});

test("Should fetch user profile", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const query = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `;

    const { me: profile } = await client.request(query);

    expect(profile.id).toBe(userOne.user.id);
    expect(profile.name).toBe(userOne.user.name);
    expect(profile.email).toBe(userOne.user.email);
});
