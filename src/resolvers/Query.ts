import { getUserId } from "../utils";

const Query = {
    async users(
        _parent: any,
        { query, skip, take }: { query: string; skip: number; take: number },
        { prisma }: any,
        _info: any
    ) {
        if (!query) {
            return await prisma.user.findMany({
                skip,
                take,
                include: {
                    posts: true,
                    comments: true,
                },
            });
        }

        return await prisma.user.findMany({
            skip,
            take,
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
        { query, skip, take }: { query: string; skip: number; take: number },
        { prisma }: any,
        _info: any
    ) {
        if (!query) {
            return await prisma.post.findMany({ skip, take });
        }

        return await prisma.post.findMany({
            skip,
            take,
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
    async comments(
        _parent: any,
        { skip, take }: { skip: number; take: number },
        { prisma }: any,
        _info: any
    ) {
        return await prisma.comment.findMany({ skip, take });
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
