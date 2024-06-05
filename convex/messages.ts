import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserById } from "./_utils";

export const get = query({
  args: {
    id: v.id("conversations"),
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
        q.eq("conversationId", args.id).eq("memberId", currentUser._id)
      )
      .unique();
    if (!membership) {
      throw new ConvexError("You aren't member of this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .order("desc")
      .collect();

    const messageWithUser = Promise.all(
      messages.map(async (message) => {
        const messageSender = await ctx.db.get(message.senderId);

        if (!messageSender) {
          throw new ConvexError("Could not find sender of message");
        }

        return {
          message,
          senderImage: messageSender.imageurl,
          senderName: messageSender.username,
          isCurrentUser: messageSender._id === currentUser._id,
        };
      })
    );

    return messageWithUser;
  },
});
