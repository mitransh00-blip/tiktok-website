import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {products.length === 0 && <p className="text-white text-center mt-10">No products yet...</p>}
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}