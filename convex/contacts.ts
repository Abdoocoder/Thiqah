import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAdminQuery } from "./users";

export const list = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdminQuery(ctx);
    const contacts = await ctx.db.query("contacts").order("desc").collect();
    if (args.search) {
      const s = args.search.toLowerCase();
      return contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.phone.toLowerCase().includes(s) ||
          c.message.toLowerCase().includes(s)
      );
    }
    return contacts;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const recent = await ctx.db
      .query("contacts")
      .filter((q) => q.gte(q.field("createdAt"), Date.now() - 60000))
      .collect();
    if (recent.length > 5) throw new Error("Too many messages — try again later");

    return await ctx.db.insert("contacts", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { read: true });
  },
});

export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
