const Subscription = {
    count: {
        subscribe(_parent: any, _args: any, { pubsub }: any, _info: any) {
            let count = 0;

            setInterval(() => {
                count++;
                if (count < 4) {
                    pubsub.publish("count", {
                        count,
                    });
                }
            }, 1000);

            return pubsub.subscribe("count");
        },
    },
    comment: {
        subscribe(_parent: any, { postId }: any, { pubsub }: any, _info: any) {
            return pubsub.subscribe(`comment ${postId}`);
        },
    },
    post: {
        subscribe(_: any, __: any, { pubsub }: any) {
            return pubsub.subscribe("post");
        },
    },
};

export { Subscription as default };
