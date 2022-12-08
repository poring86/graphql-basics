import { verify } from "jsonwebtoken";

const APP_SECRET = require("dotenv").config().parsed.APP_SECRET;

function getUserId(context: any) {
    const authHeader = context.request.headers.get("authorization");

    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const verifiedToken: any = verify(token, APP_SECRET);

        return verifiedToken && verifiedToken.userId;
    }
}

export { APP_SECRET, getUserId };
