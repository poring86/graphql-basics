const Comment = {
    async author(parent: any, _args: any, { prisma }: any, _info: any) {
        return await prisma.user.findUnique({
            where: {
                id: parent.userId,
            },
        });
    },
    async post(parent: any, _args: any, { prisma }: any, _info: any) {
        return await prisma.post.findUnique({
            where: {
                id: parent.postId,
            },
        });
    },
};

export { Comment as default };
