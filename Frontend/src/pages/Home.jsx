import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import GlassNavbar from "../components/GlassNavbar";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24">

      <GlassNavbar />

      <div className="max-w-7xl mx-auto px-5">

        {products.length === 0 && (
          <p className="text-gray-400 text-center mt-20">
            No products yet...
          </p>
        )}

        <div className="grid gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            auto-rows-fr">

         {products.map(product => (
  <div key={product._id} className="text-white p-4">
    {product.title}
  </div>
))}

        </div>
      </div>
    </div>
  );
}