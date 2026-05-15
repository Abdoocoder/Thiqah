import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAdminQuery } from "./users";

export const list = query({
  args: { search: v.optional(v.string()), statusFilter: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdminQuery(ctx);
    const orders = await ctx.db.query("orders").order("desc").collect();
    let filtered = orders;
    if (args.search) {
      const s = args.search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(s) ||
          o.customerPhone.toLowerCase().includes(s)
      );
    }
    if (args.statusFilter) {
      filtered = filtered.filter((o) => o.status === args.statusFilter);
    }
    return filtered;
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await requireAdminQuery(ctx);
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    customerName: v.string(),
    customerPhone: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    total: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const recent = await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("createdAt"), Date.now() - 60000))
      .collect();
    if (recent.length > 10) throw new Error("Too many orders — please wait");

    return await ctx.db.insert("orders", {
      ...args,
      status: "جديد",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("orders"), status: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
