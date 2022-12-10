import { getUserId } from "../utils";

const Query = {
    async users(
        _parent: any,
        { query }: { query: string },
        { prisma }: any,
        _info: any
    ) {
        if (!query) {
            return await prisma.user.findMany({
                include: {
                    posts: true,
                    comments: true,
                },
            });
        }

        return await prisma.user.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                email: {
                    contains: query,
                    mode: "insensitive",
                },
            },
        });
    },
    async me(_parent: any, _args: any, { request, prisma }: any, _info: any) {
        const userId = getUserId(request);
        try {
            return await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
        } catch (e) {
            console.log(e);
        }
    },
    async posts(
        _parent: any,
        { query }: { query: string },
        { prisma }: any,
        _info: any
    ) {
        if (!query) {
            return await prisma.post.findMany();
        }

        return await prisma.post.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive",
                },
                body: {
                    contains: query,
                    mode: "insensitive",
                },
            },
        });
    },
    async comments(_parent: any, _args: any, { prisma }: any, _info: any) {
        return await prisma.comment.findMany();
    },
    add(_parent: any, args: { numbers: any[] }, _ctx: any, _info: any) {
        if (args.numbers.length === 0) {
            return 0;
        }

        const value = args.numbers.reduce(
            (accumulator: any, currentValue: any) => {
                return accumulator + currentValue;
            }
        );

        return value;
    },
};

export { Query as default };
