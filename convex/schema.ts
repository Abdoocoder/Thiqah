import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    role: v.union(v.literal("admin"), v.literal("employee")),
    name: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  products: defineTable({
    name: v.string(),
    nameAr: v.string(),
    category: v.string(),
    categoryAr: v.string(),
    price: v.number(),
    description: v.string(),
    descriptionAr: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    stock: v.number(),
    unit: v.string(),
    active: v.boolean(),
  }),

  offers: defineTable({
    title: v.string(),
    titleAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    discount: v.number(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    expiryDate: v.number(),
    active: v.boolean(),
  }),

  orders: defineTable({
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
    status: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }),
});
