import "cross-fetch/polyfill";
import { PrismaClient } from "@prisma/client";
import { GraphQLClient } from "graphql-request";
import seedDatabase, {
    userOne,
    comment1,
    comment2,
} from "./utils/seedDatabase";
import { deleteCommentMutation } from "./utils/operations";

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");
const prisma = new PrismaClient();

beforeEach(seedDatabase);

test("Should delete own comment", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const variables = {
        id: comment1.id,
    };

    await client.request(deleteCommentMutation, variables);

    const deletetedComment = await prisma.comment.findUnique({
        where: {
            id: comment1.id,
        },
    });

    expect(deletetedComment).toBe(null);
});

test("Should not delete other user comment", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const variables = {
        id: comment2.id,
    };

    expect(client.request(deleteCommentMutation, variables)).rejects.toThrow();
});
