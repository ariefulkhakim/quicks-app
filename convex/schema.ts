import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    imageurl: v.string(),
    userId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_userId", ["userId"]),
  request: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
  })
    .index("by_receiver", ["receiver"])
    .index("by_receiver_sender", ["receiver", "sender"]),
  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    conversationId: v.id("conversations"),
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_conversationId", ["conversationId"]),
  conversations: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
  }),
  conversationMembers: defineTable({
    memberId: v.id("users"),
    conversationId: v.id("conversations"),
    lastSeenMessage: v.optional(v.id("messages")),
  })
    .index("by_memberId", ["memberId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_memberId_conversationId", ["conversationId", "memberId"]),
  messages: defineTable({
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  }).index("by_conversationId", ["conversationId"]),
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    dueDate: v.string(),
    creatorId: v.id("users"),
  })
    .index("by_dueDate", ["dueDate"])
    .index("by_status", ["status"])
    .index("by_creator", ["creatorId"]),
});
