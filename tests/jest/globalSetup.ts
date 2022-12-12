import server from "../../src/server";

module.exports = async () => {
    global.httpServer = await server.start();
};
