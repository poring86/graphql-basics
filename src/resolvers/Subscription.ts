import { GraphQLYogaError } from "@graphql-yoga/node";

import { Post } from "../types/global";

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
    subscribe(_parent: any, { postId }: any, { db, pubsub }: any, _info: any) {
      const post = db.posts.find((post: Post) => {
        return post.id === postId && post.published;
      });

      if (!post) {
        throw new GraphQLYogaError("Post not found");
      }

      // return pubsub.subscribe(`comment`);
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
