import { gql } from "graphql-request";

const postsQuery = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`;

const myPostsQuery = gql`
    query {
        myPosts {
            id
            title
            body
            published
        }
    }
`;

const updatePostMutation = gql`
    mutation ($id: ID!, $data: UpdatePostInput!) {
        updatePost(id: $id, data: $data) {
            id
            title
            body
            published
        }
    }
`;

const createPostMutation = gql`
    mutation ($data: CreatePostInput!) {
        createPost(data: $data) {
            id
            title
            body
            published
        }
    }
`;

const deletePostMutation = gql`
    mutation ($id: ID!) {
        deletePost(id: $id) {
            id
            title
            body
            published
        }
    }
`;

const createUserMutation = gql`
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

const loginMutation = gql`
    mutation ($data: LoginUserInput!) {
        login(data: $data) {
            token
        }
    }
`;

const profileQuery = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

const deleteCommentMutation = gql`
    mutation ($id: ID!) {
        deleteComment(id: $id) {
            id
            text
        }
    }
`;

export {
    postsQuery,
    myPostsQuery,
    updatePostMutation,
    createPostMutation,
    deletePostMutation,
    createUserMutation,
    loginMutation,
    profileQuery,
    deleteCommentMutation,
};
