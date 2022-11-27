const Query = {
  users(parent, args, { db }, info) {
    console.log("test", db);
    if (!args.query) {
      return db.users;
    }

    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  greeting(parent, args, { db }, info) {
    if (args.name && args.position) {
      return `Hello, ${args.name}! You are my favorite ${args.position}`;
    } else {
      return "Hello!";
    }
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());

      return isTitleMatch || isBodyMatch;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  add(parent, args, ctx, info) {
    if (args.numbers.length === 0) {
      return 0;
    }

    const value = args.numbers.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });

    return value;
  },
  me() {
    return {
      id: "123098",
      name: "Mike",
      email: "mike@example.com",
      age: 28,
    };
  },
  post() {
    return {
      id: "092",
      title: "GraphQL 101",
      body: "",
      published: false,
    };
  },
};

export { Query as default };
