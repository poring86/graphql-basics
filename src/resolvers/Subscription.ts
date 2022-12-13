const Subscription = {
    count: {
        subscribe(
            _parent: unknown,
            _args: unknown,
            { pubsub }: any,
            _info: unknown
        ) {
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
        subscribe(
            _parent: unknown,
            { postId }: any,
            { pubsub }: any,
            _info: unknown
        ) {
            return pubsub.subscribe(`comment ${postId}`);
        },
    },
    post: {
        subscribe(
            _parent: unknown,
            _args: unknown,
            { pubsub }: any,
            _info: unknown
        ) {
            return pubsub.subscribe("post");
        },
    },
};

export { Subscription as default };
