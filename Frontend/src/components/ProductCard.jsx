import React from "react";
import api from "../services/api";
import VideoPlayer from "./VideoPlayer"; // autoplay video on scroll

export default function ProductCard({ product }) {
  const handleBuy = async () => {
    try {
      await api.patch(`/products/${product._id}/buy`);
      alert("Purchased! Quantity reduced");
    } catch (err) {
      console.error(err);
      alert("Purchase failed");
    }
  };

  return (
    <div className="h-screen snap-start flex flex-col">
      <div className="flex-3">
        <VideoPlayer src={product.mediaUrl} />
      </div>
      <div className="flex-1 p-4 bg-black">
        <h2 className="text-lg font-bold">{product.title || "Product name"}</h2>
        <p className="text-sm opacity-80">{product.caption || "No description"}</p>
        <p className="text-green-400 font-bold">₦{product.price || "0"}</p>
        <button
          onClick={handleBuy}
          className="mt-2 bg-red-600 px-4 py-2 rounded text-white"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}