import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";

async function getUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first();

  if (user && user.role !== "admin") throw new Error("Unauthorized: admin only");

  return { identity, user };
}

export async function requireAdmin(ctx: MutationCtx) {
  const { identity, user } = await getUser(ctx);
  if (!user) {
    await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      role: "admin",
      name: identity.name || undefined,
    });
  }
}

export async function requireAdminQuery(ctx: QueryCtx) {
  await getUser(ctx);
}

export const getByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();
  },
});

export const syncCurrentUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!existing) {
      await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        role: "admin",
        name: identity.name || undefined,
      });
    }
  },
});

export const listUsers = query({
  handler: async (ctx) => {
    await requireAdminQuery(ctx);
    return await ctx.db.query("users").collect();
  },
});

export const setRole = mutation({
  args: { id: v.id("users"), role: v.union(v.literal("admin"), v.literal("employee")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { role: args.role });
  },
});
