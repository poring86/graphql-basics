let comments = [
  {
    id: "1",
    text: "Comment",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text: "Comment",
    author: "1",
    post: "1",
  },
  {
    id: "3",
    text: "Comment",
    author: "1",
    post: "1",
  },
  {
    id: "4",
    text: "Comment",
    author: "1",
    post: "1",
  },
];

let posts = [
  {
    id: "1",
    title: "Post 1",
    body: "body 1",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Post 2",
    body: "body 2",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "Post 3",
    body: "body 3",
    published: true,
    author: "1",
  },
  {
    id: "4",
    title: "Post 4",
    body: "body 4",
    published: true,
    author: "2",
  },
];

let users = [
  {
    id: "1",
    name: "Matheus",
    email: "matheus@test.com",
    age: 20,
  },
  {
    id: "2",
    name: "Lino",
    email: "lino@test.com",
    age: 21,
  },
  {
    id: "3",
    name: "Ferreira",
    email: "ferreira@test.com",
    age: 22,
  },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
