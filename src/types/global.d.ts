export interface UserType {
    id: string;
    name: string;
    email: string;
    age?: number;
    password: string;
}

export interface PostType {
    id: string;
    title: string;
    body: string;
    published: boolean;
    userId: string;
}

export interface CommentType {
    id: string;
    text: string;
    userId: string;
    postId: string;
}

export interface CreateUserInput {
    name: string;
    email: string;
    age: number;
    password: string;
}

export interface UpdateUserInput {
    name: string;
    email: string;
    age: number;
}

export interface CreatePostInput {
    title: string;
    body: string;
    published: boolean;
}

export interface UpdatePostInput {
    title: string;
    body: string;
    published: boolean;
}

export interface CreateCommentInput {
    text: string;
    post: string;
}

export interface UpdateCommentInput {
    text: string;
}

export interface CreateUserResponse {
    token: string;
    user: UserType;
}

declare global {
    var httpServer: any;
}
