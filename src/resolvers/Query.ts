import { getUserId } from "../utils";

const Query = {
    async users(
        _parent: unknown,
        {
            query,
            skip,
            take,
            after,
        }: { query: string; skip: number; take: number; after: string },
        { prisma }: any,
        _info: unknown
    ) {
        const queryObject: any = {
            skip,
            take,
        };

        if (after) queryObject.cursor = { id: after };

        if (query)
            queryObject.where = {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                email: {
                    contains: query,
                    mode: "insensitive",
                },
            };

        try {
            return await prisma.user.findMany(queryObject);
        } catch (e) {
            console.log(e);
        }
    },
    async me(
        _parent: unknown,
        _args: unknown,
        { request, prisma }: any,
        _info: unknown
    ) {
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
        _parent: unknown,
        {
            query,
            skip,
            take,
            after,
        }: { query: string; skip: number; take: number; after: string },
        { prisma }: any,
        _info: unknown
    ) {
        const queryObject: any = {
            skip,
            take,
        };

        if (after) queryObject.cursor = { id: after };

        if (query)
            queryObject.where = {
                title: {
                    contains: query,
                    mode: "insensitive",
                },
                body: {
                    contains: query,
                    mode: "insensitive",
                },
            };

        try {
            return await prisma.post.findMany(queryObject);
        } catch (e) {
            console.log(e);
        }
    },
    async myPosts(
        _parent: unknown,
        {
            query,
            skip,
            take,
            after,
        }: { query: string; skip: number; take: number; after: string },
        { prisma, request }: any,
        _info: unknown
    ) {
        const userId = getUserId(request);

        const queryObject: any = {
            skip,
            take,
            where: {
                userId,
            },
        };

        if (after) queryObject.cursor = { id: after };

        if (query)
            queryObject.where = {
                userId,

                title: {
                    contains: query,
                    mode: "insensitive",
                },
                body: {
                    contains: query,
                    mode: "insensitive",
                },
            };

        try {
            return await prisma.post.findMany(queryObject);
        } catch (e) {
            console.log(e);
        }
    },
    async comments(
        _parent: unknown,
        { skip, take, after }: { skip: number; take: number; after: string },
        { prisma }: any,
        _info: unknown
    ) {
        const queryObject: any = {
            skip,
            take,
        };
        if (after) queryObject.cursor = { id: after };

        try {
            return await prisma.comment.findMany(queryObject);
        } catch (e) {
            console.log(e);
        }
    },
};

export { Query as default };
