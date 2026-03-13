import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function OrderRequestModal({ product, onClose, onSuccess }) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = product?.price * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/orders', {
        productId: product._id,
        quantity,
        size,
        color,
        totalPrice,
      });

      onSuccess(res.data, 'request');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-3xl p-6 w-full max-w-md border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{t('orderRequest')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Product Summary */}
          <div className="flex gap-4 mb-6 p-3 bg-white/5 rounded-xl">
            <img
              src={product?.mediaUrl}
              alt={product?.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{product?.title}</h3>
              <p className="text-mitransh-400 font-bold">{product?.price} XAF</p>
              <p className="text-xs text-gray-400">@{product?.seller?.username}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">{t('quantity')}</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 text-white text-xl"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product?.quantity || 1}
                  className="w-20 text-center py-2 rounded-xl bg-white/10 text-white border border-white/20"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product?.quantity || 1, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-white/10 text-white text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Size */}
            {product?.sizes?.length > 0 && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">{t('size')}</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        size === s
                          ? 'bg-mitransh-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product?.colors?.length > 0 && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">{t('color')}</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        color === c
                          ? 'bg-mitransh-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Total Price */}
            <div className="p-4 bg-mitransh-600/20 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{t('amount')}:</span>
                <span className="text-2xl font-bold text-white">{totalPrice} XAF</span>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold"
              >
                {t('cancel')}
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-mitransh-600 to-mitransh-500 text-white font-semibold disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? t('loading') : t('sendRequest')}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

