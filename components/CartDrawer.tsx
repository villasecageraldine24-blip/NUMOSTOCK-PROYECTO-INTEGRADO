import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQty, 
  onCheckout 
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Tu Carrito</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>Tu carrito está vacío.</p>
                <button onClick={onClose} className="mt-4 text-primary font-semibold hover:underline">
                  Volver al catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 border-b border-gray-100 pb-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-primary font-bold">${item.price.toLocaleString('es-CL')}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Total</span>
                <span className="text-xl font-bold text-gray-900">${total.toLocaleString('es-CL')}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-sky-600 transition-colors shadow-lg"
              >
                Ir a Pagar
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                Stock sincronizado con Odoo
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};