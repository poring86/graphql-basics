import { hash } from "bcryptjs";
import { GraphQLYogaError } from "graphql-yoga";
import { sign, verify } from "jsonwebtoken";

const APP_SECRET = require("dotenv").config().parsed.APP_SECRET;

function getUserId(request: any) {
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const verifiedToken: any = verify(token, APP_SECRET);

        return verifiedToken && verifiedToken.userId;
    }
}

const hashedPassword = async (password: string) => {
    if (password.length < 8) {
        throw new GraphQLYogaError("Password must be 8 characters or longer.");
    }
    return await hash(password, 10);
};

const generateToken = (userId: string) => {
    return sign({ userId }, APP_SECRET, { expiresIn: "7 days" });
};

export { APP_SECRET, getUserId, hashedPassword, generateToken };
