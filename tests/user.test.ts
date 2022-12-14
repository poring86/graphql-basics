import "cross-fetch/polyfill";
import { GraphQLClient, gql } from "graphql-request";
import { PrismaClient } from "@prisma/client";
import seedDatabase from "./utils/seedDatabase";
import { userOne } from "./utils/seedDatabase";
import {
    createUserMutation,
    loginMutation,
    profileQuery,
} from "./utils/operations";

const prisma = new PrismaClient();

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");

beforeEach(seedDatabase);

test("Should create a new user", async () => {
    const variables = {
        data: {
            name: "Test",
            email: "test@test.com",
            password: "12345678",
        },
    };
    const mutation = gql`
        mutation ($data: CreateUserInput!) {
            createUser(data: $data) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `;

    const response = await client.request(mutation, variables);

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
    const variables = {
        data: {
            email: "invalid@invalid.com",
            password: "invalid",
        },
    };

    await expect(client.request(loginMutation, variables)).rejects.toThrow();
});

test("Should not signup user with short password", async () => {
    const variables = {
        data: {
            name: "Test",
            email: "test@test.com",
            password: "pass",
        },
    };

    await expect(
        client.request(createUserMutation, variables)
    ).rejects.toThrow();
});

test("Should fetch user profile", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const { me: profile } = await client.request(profileQuery);

    expect(profile.id).toBe(userOne.user.id);
    expect(profile.name).toBe(userOne.user.name);
    expect(profile.email).toBe(userOne.user.email);
});
