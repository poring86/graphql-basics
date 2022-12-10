import { Comment } from "../types/global";
const Comment = {
    async author(parent: Comment, _args: any, { prisma }: any, _info: any) {
        return await prisma.user.findUnique({
            where: {
                id: parent.userId,
            },
        });
    },
    async post(parent: Comment, _args: any, { prisma }: any, _info: any) {
        return await prisma.post.findUnique({
            where: {
                id: parent.postId,
            },
        });
    },
};

export { Comment as default };
