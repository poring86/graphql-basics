import "cross-fetch/polyfill";
import { GraphQLClient, gql } from "graphql-request";
import seedDatabase from "./utils/seedDatabase";
import { userOne } from "./utils/seedDatabase";

const client = new GraphQLClient("http://127.0.0.1:4000/graphql");

beforeEach(seedDatabase);

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

test("Should fetch user posts", async () => {
    client.setHeader("authorization", `Bearer ${userOne.token}`);
    const query = gql`
        query {
            myPosts {
                id
            }
        }
    `;

    const response = await client.request(query);

    expect(response.myPosts.length).toBe(2);
});
