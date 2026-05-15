import { mutation } from "./_generated/server";
import { requireAdmin } from "./users";

export const seed = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.query("products").collect();
    for (const p of existing) await ctx.db.delete(p._id);

    const existingOffers = await ctx.db.query("offers").collect();
    for (const o of existingOffers) await ctx.db.delete(o._id);

    const existingOrders = await ctx.db.query("orders").collect();
    for (const o of existingOrders) await ctx.db.delete(o._id);

    const existingContacts = await ctx.db.query("contacts").collect();
    for (const c of existingContacts) await ctx.db.delete(c._id);

    const oliveOil = await ctx.db.insert("products", {
      name: "Premium Extra Virgin Olive Oil",
      nameAr: "زيت زيتون بكر ممتاز",
      category: "Olive Oil",
      categoryAr: "زيت زيتون",
      price: 25,
      description: "Cold-pressed extra virgin olive oil from our family farm in Madaba.",
      descriptionAr: "زيت زيتون بكر ممتاز معصور على البارد من مزرعتنا في مأدبا.",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600",
      stock: 50,
      unit: "لتر",
      active: true,
    });

    await ctx.db.insert("products", {
      name: "Sheep Cheese",
      nameAr: "جبنة غنم بلدية",
      category: "Cheese",
      categoryAr: "أجبان",
      price: 18,
      description: "Traditional sheep cheese made with natural ingredients.",
      descriptionAr: "جبنة غنم بلدية طبيعية ١٠٠٪ مصنوعة بالطرق التقليدية.",
      imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
      stock: 30,
      unit: "كغم",
      active: true,
    });

    await ctx.db.insert("products", {
      name: "Local Samneh (Ghee)",
      nameAr: "سمن بلدي أصلي",
      category: "Ghee",
      categoryAr: "سمن",
      price: 22,
      description: "Pure local samneh (ghee) made from sheep milk.",
      descriptionAr: "سمن بلدي أصلي نقي من حليب الغنم.",
      imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600",
      stock: 40,
      unit: "كغم",
      active: true,
    });

    await ctx.db.insert("products", {
      name: "Natural Honey",
      nameAr: "عسل طبيعي",
      category: "Honey",
      categoryAr: "عسل",
      price: 30,
      description: "Pure natural honey from local beehives.",
      descriptionAr: "عسل طبيعي نقي من خلايا نحل محلية.",
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600",
      stock: 20,
      unit: "كغم",
      active: true,
    });

    await ctx.db.insert("products", {
      name: "Free-Range Eggs",
      nameAr: "بيض بلدي",
      category: "Eggs",
      categoryAr: "بيض",
      price: 5,
      description: "Fresh free-range eggs from our farm.",
      descriptionAr: "بيض بلدي طازج من مزرعتنا.",
      imageUrl: "https://images.unsplash.com/photo-1560790671-b76ca4de2ef0?w=600",
      stock: 100,
      unit: "طبق (30 بيضة)",
      active: true,
    });

    await ctx.db.insert("offers", {
      title: "Olive Oil Special Offer",
      titleAr: "عرض زيت الزيتون",
      description: "Buy 16kg tin of premium extra virgin olive oil and get 10% discount",
      descriptionAr: "اشترِ تنكة 16 كغم من زيت الزيتون البكر الممتاز واحصل على 10% خصم",
      discount: 10,
      expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      active: true,
    });

    await ctx.db.insert("offers", {
      title: "Cheese and Ghee Bundle",
      titleAr: "عرض الجبنة والسمن",
      description: "Buy 2kg sheep cheese + 1kg samneh and get a free gift",
      descriptionAr: "اشتري جبنة غنم بلدية 2 كغم + سمن بلدي واحصل على هدية مجانية",
      discount: 15,
      expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      active: true,
    });

    await ctx.db.insert("orders", {
      customerName: "أحمد علي",
      customerPhone: "0791234567",
      items: [{ productId: oliveOil, productName: "زيت زيتون بكر ممتاز", quantity: 2, price: 25 }],
      total: 50,
      status: "مكتمل",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("orders", {
      customerName: "سارة محمد",
      customerPhone: "0787654321",
      items: [{ productId: oliveOil, productName: "جبنة غنم بلدية", quantity: 1, price: 18 }],
      total: 18,
      status: "قيد التنفيذ",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("orders", {
      customerName: "خالد أحمد",
      customerPhone: "0775555555",
      items: [
        { productId: oliveOil, productName: "زيت زيتون بكر ممتاز", quantity: 1, price: 25 },
        { productId: oliveOil, productName: "سمن بلدي أصلي", quantity: 2, price: 22 },
      ],
      total: 69,
      status: "جديد",
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("contacts", {
      name: "محمد سلامة",
      email: "mohammad@example.com",
      phone: "0791111111",
      message: "أرغب في الاستفسار عن منتجاتكم وأسعار التوصيل إلى عمان.",
      read: false,
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("contacts", {
      name: "نورا حسين",
      email: "nora@example.com",
      phone: "0792222222",
      message: "هل يوجد لديكم جبنة حليب جاموس؟",
      read: true,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    });
  },
});
