import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const UserProps = {
  username: v.string(),
  imageurl: v.string(),
  userId: v.string(),
  email: v.string(),
};

export const create = internalMutation({
  args: UserProps,
  async handler(ctx, args) {
    await ctx.db.insert("users", args);
  },
});

export const get = internalQuery({
  args: { id: v.string() },
  async handler(ctx, args) {
    ctx.db.query("users").withIndex("by_userId", (q) => q.eq("userId", args.id))
      .unique;
  },
});
