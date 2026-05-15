import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./users";

export const list = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("offers");
    if (args.activeOnly) {
      q = q.filter((o) => o.eq(o.field("active"), true));
    }
    const offers = await q.collect();
    return Promise.all(
      offers.map(async (o) => ({
        ...o,
        imageUrl: o.imageStorageId
          ? await ctx.storage.getUrl(o.imageStorageId)
          : o.imageUrl || null,
      }))
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    titleAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    discount: v.number(),
    expiryDate: v.number(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("offers", {
      ...args,
      imageUrl: undefined,
      active: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("offers"),
    title: v.optional(v.string()),
    titleAr: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    discount: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    imageStorageId: v.optional(v.id("_storage")),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("offers") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
