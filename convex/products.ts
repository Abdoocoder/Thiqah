import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./users";

export const list = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products");
    if (args.activeOnly) {
      q = q.filter((p) => p.eq(p.field("active"), true));
    }
    const products = await q.collect();
    return Promise.all(
      products.map(async (p) => ({
        ...p,
        imageUrl: p.imageStorageId
          ? await ctx.storage.getUrl(p.imageStorageId)
          : p.imageUrl || null,
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    return {
      ...product,
      imageUrl: product.imageStorageId
        ? await ctx.storage.getUrl(product.imageStorageId)
        : product.imageUrl || null,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    nameAr: v.string(),
    category: v.string(),
    categoryAr: v.string(),
    price: v.number(),
    description: v.string(),
    descriptionAr: v.string(),
    stock: v.number(),
    unit: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("products", {
      ...args,
      imageUrl: undefined,
      active: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    nameAr: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryAr: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    stock: v.optional(v.number()),
    unit: v.optional(v.string()),
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
  args: { id: v.id("products") },
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
