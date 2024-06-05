import { MutationCtx, QueryCtx } from "./_generated/server";

export const getUserById = async ({
  ctx,
  userId,
}: {
  ctx: QueryCtx | MutationCtx;
  userId: string;
}) => {
  return await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
};
