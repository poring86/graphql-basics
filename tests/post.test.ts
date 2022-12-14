import "cross-fetch/polyfill";
import { PrismaClient } from "@prisma/client";
import { GraphQLClient } from "graphql-request";
import seedDatabase, { post1, post2 } from "./utils/seedDatabase";
import { userOne } from "./utils/seedDatabase";
import {
    createPostMutation,
    deletePostMutation,
    postsQuery,
    myPostsQuery,
    updatePostMutation,
} from "./utils/operations";

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");
const prisma = new PrismaClient();

beforeEach(seedDatabase);

test("Should show published posts", async () => {
    const { posts } = await client.request(postsQuery);

    expect(posts.length).toBeGreaterThan(0);
});

test("Should fetch user posts", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const { myPosts } = await client.request(myPostsQuery);

    expect(myPosts.length).toBe(2);
});

test("Should be able to update own post", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const variables = {
        id: post1.id,
        data: {
            published: false,
        },
    };

    const { updatePost } = await client.request(updatePostMutation, variables);

    expect(updatePost.published).toBe(false);
});

test("Should create a new post", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const variables = {
        data: {
            title: "Learn Jest",
            body: "Automated tests",
            published: true,
        },
    };

    const { createPost } = await client.request(createPostMutation, variables);

    expect(createPost.title).toBe("Learn Jest");
    expect(createPost.body).toBe("Automated tests");
    expect(createPost.published).toBe(true);
});

test("Should delete post", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);

    const variables = {
        id: post2.id,
    };

    await client.request(deletePostMutation, variables);

    const deletetedPost = await prisma.post.findUnique({
        where: {
            id: post2.id,
        },
    });

    expect(deletetedPost).toBe(null);
});
