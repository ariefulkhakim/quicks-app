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

    const conversations = await ctx.db.get(args.id);

    if (!conversations) {
      throw new ConvexError("Conversation not found");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("conversationId", conversations._id)
          .eq("memberId", currentUser._id)
      )
      .unique();
    if (!membership) {
      throw new ConvexError("You aren't member of this conversation");
    }

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversations.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];
      const otherMember = await ctx.db.get(
        otherMembership === undefined
          ? currentUser._id
          : otherMembership.memberId
      );

      return {
        ...conversations,
        otherMember: {
          ...otherMember,
          lastSeenMessageId:
            otherMembership === undefined
              ? undefined
              : otherMembership.lastSeenMessage,
        },
        otherMembers: null,
      };
    } else {
      const otherMembers = await Promise.all(
        allConversationMemberships
          .filter((membership) => membership.memberId !== currentUser._id)
          .map(async (params) => {
            const member = await ctx.db.get(params.memberId);

            if (!member) {
              throw new ConvexError("Member could not be found");
            }

            return {
              _id: member._id,
              username: member.username,
            };
          })
      );

      return {
        ...conversations,
        otherMembers,
        otherMember: null,
      };
    }
  },
});

export const createChat = mutation({
  args: {
    id: v.id("users"),
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
      isGroup: false,
    });

    await ctx.db.insert("conversationMembers", {
      memberId: currentUser._id,
      conversationId,
    });

    await ctx.db.insert("conversationMembers", {
      memberId: args.id,
      conversationId,
    });
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

export const removeGroup = mutation({
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
    if (!membership || membership.length <= 1) {
      throw new ConvexError("This conversation does not have any members.");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    await ctx.db.delete(args.conversationId);

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

export const leaveGroup = mutation({
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
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("conversationId", args.conversationId)
          .eq("memberId", currentUser._id)
      )
      .unique();
    if (!membership) {
      throw new ConvexError("You are not a member this group");
    }

    await ctx.db.delete(membership._id);
  },
});

export const markRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
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
      throw new ConvexError("You are not a member this group");
    }

    const lastMessage = await ctx.db.get(args.messageId);

    await ctx.db.patch(membership._id, {
      lastSeenMessage: lastMessage ? lastMessage._id : undefined,
    });
  },
});
