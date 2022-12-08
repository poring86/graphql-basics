export interface User {
    id: string;
    name: string;
    email: string;
    age?: number;
    password: string;
}

export interface Post {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: string;
}

export interface Comment {
    id: string;
    text: string;
    author: string;
    post: string;
}
