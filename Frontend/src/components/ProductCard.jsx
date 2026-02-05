import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl"
    >
      <video
        src={product.mediaUrl}
        className="w-full h-[320px] object-cover"
        muted
        loop
        playsInline
        autoPlay
      />

      <div className="p-4">
        <h3 className="text-white font-semibold">
          {product.title}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-white font-bold">
            ₦{product.price}
          </span>

          <button className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-sm">
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
}