import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserById } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
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

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("conversationId", args.conversationId)
          .eq("memberId", currentUser._id)
      )
      .unique();
    if (!membership) {
      throw new ConvexError("You aren't member of this conversation");
    }

    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...args,
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageId: message,
    });

    return message;
  },
});
