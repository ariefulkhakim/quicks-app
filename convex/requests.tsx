import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserById } from "./_utils";

export const get = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserById({ ctx, userId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User could not be found");
    }

    const requests = await ctx.db
      .query("request")
      .withIndex("by_receiver", (e) => e.eq("receiver", currentUser._id))
      .collect();

    const requestWithSender = await Promise.all(
      requests.map(async (request) => {
        const sender = await ctx.db.get(request.sender);

        if (!sender) {
          throw new ConvexError("Request sender could not be found");
        }

        return { request, sender };
      })
    );

    return requestWithSender;
  },
});

export const count = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserById({ ctx, userId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User could not be found");
    }

    const requests = await ctx.db
      .query("request")
      .withIndex("by_receiver", (e) => e.eq("receiver", currentUser._id))
      .collect();

    return requests.length;
  },
});
