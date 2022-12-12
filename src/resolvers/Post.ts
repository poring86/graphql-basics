import { PostType } from "../types/global";
const Post = {
    async author(parent: PostType, _args: any, { prisma }: any, _info: any) {
        return await prisma.user.findUnique({
            where: {
                id: parent.userId,
            },
        });
    },
    async comments(parent: PostType, _args: any, { prisma }: any, _info: any) {
        return await prisma.comment.findMany({
            where: {
                postId: parent.id,
            },
        });
    },
};

export { Post as default };
