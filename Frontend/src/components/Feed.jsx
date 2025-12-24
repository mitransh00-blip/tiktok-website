import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "../services/api";

export default function Feed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {products.length === 0 && (
        <p style={{ color: "white", textAlign: "center", marginTop: "50%" }}>
          Loading products...
        </p>
      )}

      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}