import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function PaymentModal({ order, onClose, onSuccess }) {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (method) => {
    setPaymentMethod(method);
    setLoading(true);
    setError('');

    try {
      if (method === 'mtn') {
        window.location.href = 'tel:*126#';
      } else if (method === 'orange') {
        window.location.href = 'tel:#123#';
      }

      const res = await api.put(`/orders/${order._id}/pay`, {
        paymentMethod: method,
      });

      onSuccess(res.data, 'payment');
    } catch (err) {
      setError(err.response?.data?.msg || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        className="bg-gray-900 rounded-3xl p-6 w-full max-w-md border border-white/20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{t('payment')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Order:</span>
            <span className="text-white font-medium">#{order._id.slice(-8)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">{t('amount')}:</span>
            <span className="text-2xl font-bold text-mitransh-400">{order.totalPrice} XAF</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">{t('deliveryWithin7Days')}</p>
        </div>

        <p className="text-gray-300 mb-4">{t('payWith')}:</p>

        <motion.button
          onClick={() => handlePayment('mtn')}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-yellow-500 text-black font-bold mb-3 flex items-center justify-center gap-3 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl">🟡</span>
          <div className="text-left">
            <p className="text-lg">{t('mtn')}</p>
            <p className="text-xs font-normal text-black/70">{t('mtnInstructions')}</p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => handlePayment('orange')}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold mb-3 flex items-center justify-center gap-3 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl">🟠</span>
          <div className="text-left">
            <p className="text-lg">{t('orange')}</p>
            <p className="text-xs font-normal text-white/70">{t('orangeInstructions')}</p>
          </div>
        </motion.button>

        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

        <div className="mt-6 p-3 bg-blue-600/20 rounded-xl">
          <p className="text-xs text-gray-400 text-center">{t('autoRefund')}</p>
        </div>

        <button onClick={onClose} className="w-full mt-4 py-3 rounded-xl bg-white/10 text-white font-semibold">
          {t('cancel')}
        </button>
      </motion.div>
    </div>
  );
}

