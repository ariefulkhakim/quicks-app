import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserById } from "./_utils";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    status: v.optional(v.string()),
    title: v.optional(v.string()),
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

    let tasksQuery = await ctx.db
      .query("tasks")
      .withIndex("by_creator", (q) => q.eq("creatorId", currentUser._id))
      .collect();

    if (args.status) {
      tasksQuery = tasksQuery.filter((q) => q.status === args.status);
    }

    if (args.title) {
      const regex = new RegExp(args.title, "i");
      tasksQuery = tasksQuery.filter((q) => regex.test(q.title));
    }

    return tasksQuery;
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    dueDate: v.string(),
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

    const tasks = await ctx.db.insert("tasks", {
      creatorId: currentUser._id,
      ...args,
    });
    return tasks;
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    dueDate: v.string(),
  },
  async handler(ctx, { taskId, title, description, status, dueDate }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserById({ ctx, userId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User could not be found");
    }

    const task = await ctx.db.get(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    const tasks = await ctx.db.patch(taskId, {
      title,
      description: description ?? task.description,
      status,
      dueDate,
    });
    return tasks;
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  async handler(ctx, { taskId }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const currentUser = await getUserById({ ctx, userId: identity.subject });

    if (!currentUser) {
      throw new ConvexError("User could not be found");
    }

    const task = await ctx.db.get(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    const tasks = await ctx.db.delete(taskId);
    return tasks;
  },
});
