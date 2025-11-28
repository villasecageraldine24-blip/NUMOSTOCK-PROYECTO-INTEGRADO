import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.rop;
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-secondary hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
         {isLowStock && !isOutOfStock && (
          <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">
            ¡Quedan pocos!
          </span>
        )}
        {product.price < 4000 && (
           <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">
            OFERTA
          </span>
        )}
      </div>

      <div className="relative aspect-square w-full overflow-hidden bg-white p-4 flex items-center justify-center">
        <img 
          src={imgSrc} 
          alt={product.name} 
          onError={() => setImgSrc(`https://placehold.co/400x400/f1f5f9/003366?text=${encodeURIComponent(product.category)}`)}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-gray-800 text-white font-bold text-sm px-4 py-2 rounded uppercase tracking-wide">Sin Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow border-t border-gray-100 bg-gray-50/50">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">{product.category}</div>
        <h3 className="text-gray-900 font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
             <span className="text-xl font-black text-primary">
              ${product.price.toLocaleString('es-CL')}
            </span>
            <span className="text-xs text-gray-400 font-normal">
              + IVA
            </span>
          </div>
          <p className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
             Stock Online: {product.stock} un.
          </p>
        </div>
        
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-2.5 rounded text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
            isOutOfStock 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-secondary text-white hover:bg-orange-600 shadow-md hover:shadow-lg transform active:scale-[0.98]'
          }`}
        >
          {isOutOfStock ? (
            'Agotado'
          ) : (
            <>
              Agregar
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};