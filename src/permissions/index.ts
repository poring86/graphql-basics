import { rule, shield } from "graphql-shield";
import { getUserId } from "../utils";

const rules = {
    isAuthenticatedUser: rule()((_parent, _args, { request }) => {
        const userId = getUserId(request);
        return Boolean(userId);
    }),
    isPostOwner: rule()(async (_parent, args, { request, prisma }) => {
        const userId = getUserId(request);
        const author = await prisma.post
            .findUnique({
                where: {
                    id: args.id,
                },
            })
            .author();
        return userId === author.id;
    }),
    isCommentOwner: rule()(async (_parent, args, { request, prisma }) => {
        const userId = getUserId(request);
        const author: any = await prisma.comment
            .findUnique({
                where: {
                    id: args.id,
                },
            })
            .author();

        return userId === author.id;
    }),
};

const permissions = shield({
    Query: {
        me: rules.isAuthenticatedUser,
    },
    Mutation: {
        createPost: rules.isAuthenticatedUser,
        updatePost: rules.isPostOwner,
        deletePost: rules.isPostOwner,
        createComment: rules.isAuthenticatedUser,
        deleteComment: rules.isCommentOwner,
        updateComment: rules.isCommentOwner,
    },
});

export default permissions;
