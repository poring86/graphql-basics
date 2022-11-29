const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      console.log("count", count);

      setInterval(() => {
        console.log("pubsub", pubsub.subscribe);
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
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find((post) => {
        return post.id === postId && post.published;
      });

      if (!post) {
        throw new GraphQLYogaError("Post not found");
      }

      // return pubsub.subscribe(`comment`);
      return pubsub.subscribe(`comment ${postId}`);
    },
  },
};

export { Subscription as default };
