import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserById } from "./_utils";

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
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

    const conversations = await ctx.db.get(args.conversationId);

    if (!conversations) {
      throw new ConvexError("Conversation not found");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();
    if (!membership || membership.length !== 2) {
      throw new ConvexError("This conversation does not have any members.");
    }

    const freindship = await ctx.db
      .query("friends")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .unique();

    if (!freindship) {
      throw new ConvexError("Friend could not be found.");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    await ctx.db.delete(args.conversationId);

    await ctx.db.delete(freindship._id);

    await Promise.all(
      membership.map(async (member) => {
        await ctx.db.delete(member._id);
      })
    );

    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      })
    );
  },
});
