import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const products = useQuery(api.products.list, { activeOnly: true });

  return (
    <section id="products" className="py-24 px-6 max-w-7xl mx-auto w-full scroll-mt-20">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold mb-4">منتجاتنا المميزة</h3>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          جودة لا تضاهى، من مزارعنا إلى مائدتكم مباشرة.
        </p>
      </div>

      {!products ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] bg-surface-container-high rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-on-surface-variant">قريباً...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <div key={p._id} className={i === 1 ? "md:mt-12" : ""}>
              <ProductCard
                image={p.imageUrl || "/placeholder.svg"}
                category={p.categoryAr}
                title={p.nameAr}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
