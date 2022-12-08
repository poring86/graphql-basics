import { rule, shield } from "graphql-shield";
import { getUserId } from "../utils";

const rules = {
    isAuthenticatedUser: rule()((_parent, _args, context) => {
        const userId = getUserId(context);
        return Boolean(userId);
    }),
    isPostOwner: rule()(async (_parent, args, context) => {
        const userId = getUserId(context);
        const author = await context.prisma.post
            .findUnique({
                where: {
                    id: args.id,
                },
            })
            .author();
        return userId === author.id;
    }),
    isCommentOwner: rule()(async (_parent, args, context) => {
        const userId = getUserId(context);
        const author: any = await context.prisma.comment
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
