const Query = {
  async users(
    _parent: any,
    args: { query: string },
    { prisma }: any,
    _info: any
  ) {
    if (!args.query) {
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
          contains: args.query,
          mode: "insensitive",
        },
        email: {
          contains: args.query,
          mode: "insensitive",
        },
      },
      include: {
        posts: true,
        comments: true,
      },
    });
  },
  async posts(
    _parent: any,
    args: { query: string },
    { prisma }: any,
    _info: any
  ) {
    if (!args.query) {
      return await prisma.post.findMany({
        include: {
          author: true,
        },
      });
    }

    return await prisma.post.findMany({
      where: {
        title: {
          contains: args.query,
          mode: "insensitive",
        },
        body: {
          contains: args.query,
          mode: "insensitive",
        },
      },
      include: {
        author: true,
      },
    });
  },
  async comments(_parent: any, _args: any, { prisma }: any, _info: any) {
    return await prisma.comment.findMany({
      include: {
        author: true,
        post: true,
      },
    });
  },
  add(_parent: any, args: { numbers: any[] }, _ctx: any, _info: any) {
    if (args.numbers.length === 0) {
      return 0;
    }

    const value = args.numbers.reduce((accumulator: any, currentValue: any) => {
      return accumulator + currentValue;
    });

    return value;
  },
};

export { Query as default };
