import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserById } from "./_utils";
import { Id } from "./_generated/dataModel";

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

    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (e) => e.eq("user1", currentUser._id))
      .collect();
    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (e) => e.eq("user2", currentUser._id))
      .collect();

    const friendships = [...friendships1, ...friendships2];

    const friends = await Promise.all(
      friendships.map(async (item) => {
        const friend = await ctx.db.get(
          item.user1 === currentUser._id ? item.user2 : item.user1
        );

        if (!friend) {
          throw new ConvexError("Friend could not be found");
        }

        return friend;
      })
    );

    return friends;
  },
});

export const createGroup = mutation({
  args: {
    members: v.array(v.id("users")),
    name: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserById({ ctx, userId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User could not be found");
    }

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
    });

    await Promise.all(
      [...args.members, currentUser._id].map(async (params) => {
        await ctx.db.insert("conversationMembers", {
          memberId: params,
          conversationId,
        });
      })
    );
  },
});
