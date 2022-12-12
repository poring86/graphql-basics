import { CommentType } from "../types/global";
const Comment = {
    async author(parent: CommentType, _args: any, { prisma }: any, _info: any) {
        return await prisma.user.findUnique({
            where: {
                id: parent.userId,
            },
        });
    },
    async post(parent: CommentType, _args: any, { prisma }: any, _info: any) {
        return await prisma.post.findUnique({
            where: {
                id: parent.postId,
            },
        });
    },
};

export { Comment as default };
