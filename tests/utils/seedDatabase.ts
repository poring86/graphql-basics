import { PrismaClient } from "@prisma/client";
import { hashedPassword } from "../../src/utils";
const prisma = new PrismaClient();

const seedDatabase = async () => {
    await prisma.user.deleteMany();

    const password = await hashedPassword("23423423423423");

    const data: any = {
        name: "Elsa Prisma",
        email: "elsa@prisma.io",
        password,
        posts: {
            create: [
                {
                    title: "Include this post!",
                    body: "Body exaple",
                    published: true,
                },
                {
                    title: "Include this post 2!",
                    body: "Body exaple 2",
                    published: true,
                },
            ],
        },
    };
    await prisma.user.create({
        data: {
            ...data,
        },
    });
};

export { seedDatabase as default };
