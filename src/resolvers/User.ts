import { UserType } from "../types/global";

const User = {
    async posts(parent: UserType, _args: any, { prisma }: any, _info: any) {
        return await prisma.post.findMany({
            where: {
                userId: parent.id,
            },
        });
    },
    async comments(parent: UserType, _args: any, { prisma }: any, _info: any) {
        return await prisma.comment.findMany({
            where: {
                userId: parent.id,
            },
        });
    },
};

export { User as default };
