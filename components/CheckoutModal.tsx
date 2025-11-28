import React, { useState } from 'react';
import { PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (data: { name: string; email: string; paymentMethod: PaymentMethod }) => Promise<void>;
  isProcessing: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  total, 
  onConfirm,
  isProcessing
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    paymentMethod: PaymentMethod.WEBPAY
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 bg-secondary text-white">
          <h2 className="text-2xl font-bold">Finalizar Compra</h2>
          <p className="text-slate-300 text-sm">Ingresa tus datos para procesar el pedido</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Ej: Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="juan@empresa.cl"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medio de Pago</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center transition-colors ${formData.paymentMethod === PaymentMethod.WEBPAY ? 'border-primary bg-sky-50 text-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={formData.paymentMethod === PaymentMethod.WEBPAY}
                  onChange={() => setFormData({...formData, paymentMethod: PaymentMethod.WEBPAY})}
                />
                <span className="font-bold">WebPay</span>
                <span className="text-xs text-gray-500">Tarjetas</span>
              </label>
              
              <label className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center transition-colors ${formData.paymentMethod === PaymentMethod.TRANSFER ? 'border-primary bg-sky-50 text-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  className="hidden" 
                  checked={formData.paymentMethod === PaymentMethod.TRANSFER}
                  onChange={() => setFormData({...formData, paymentMethod: PaymentMethod.TRANSFER})}
                />
                <span className="font-bold">Transferencia</span>
                <span className="text-xs text-gray-500">Bancaria</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
             <span className="font-bold text-lg">Total:</span>
             <span className="font-bold text-2xl text-primary">${total.toLocaleString('es-CL')}</span>
          </div>

          <div className="flex space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-sky-600 disabled:opacity-70 flex items-center justify-center"
            >
              {isProcessing ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {isProcessing ? 'Procesando...' : 'Pagar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};