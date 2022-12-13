import { CommentType } from "../types/global";
const Comment = {
    async author(
        parent: CommentType,
        _args: unknown,
        { prisma }: any,
        _info: unknown
    ) {
        return await prisma.user.findUnique({
            where: {
                id: parent.userId,
            },
        });
    },
    async post(
        parent: CommentType,
        _args: unknown,
        { prisma }: any,
        _info: unknown
    ) {
        return await prisma.post.findUnique({
            where: {
                id: parent.postId,
            },
        });
    },
};

export { Comment as default };
