/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShoppingCart, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetail: (id: string) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onToggleWishlist: (id: string, e?: React.MouseEvent) => void;
  isCollected: boolean;
}

export default function ProductCard({
  product,
  onViewDetail,
  onAddToCart,
  onToggleWishlist,
  isCollected
}: ProductCardProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'necklace': return '項鍊 • Pendant';
      case 'ring': return '指戒 • Ring';
      case 'earrings': return '耳環 • Earrings';
      case 'choker': return '頸鏈 • Choker';
      default: return '飾品 • Accessory';
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      onClick={() => onViewDetail(product.id)}
      className="group bg-[#0e0c0d] border border-zinc-800 hover:border-[#801b30] rounded-sm overflow-hidden transition-all duration-500 flex flex-col relative cursor-pointer"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
      }}
      id={`product-card-${product.id}`}
    >
      {/* Category Tag overlay */}
      <span className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-md text-[10px] text-[#e0a899] font-mono tracking-widest px-2.5 py-1 border border-zinc-900 rounded-sm">
        {getCategoryLabel(product.category)}
      </span>

      {/* Collect icon overlay */}
      <button
        onClick={(e) => onToggleWishlist(product.id, e)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-[#241115] border border-zinc-900 text-zinc-400 hover:text-[#ea3c5d] transition-all duration-300"
        title={isCollected ? "取消收藏" : "加入收藏"}
      >
        <Heart className={`w-4 h-4 ${isCollected ? 'fill-[#ea3c5d] text-[#ea3c5d]' : ''}`} />
      </button>

      {/* Image Block */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-950">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#3a0ca3]/5 mix-blend-color group-hover:bg-transparent transition-all duration-500"></div>

        {/* Shadow Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 h-24 flex items-end">
          <p className="text-[10px] text-zinc-400 font-mono tracking-wide line-clamp-1">
            {product.material.split('、')[0]}
          </p>
        </div>

        {/* Low Stock Warning */}
        {isLowStock && (
          <span className="absolute bottom-3 left-3 bg-[#801b30] text-white text-[9px] font-mono py-0.5 px-2 tracking-widest border border-red-500 rounded-sm animate-pulse">
            席次緊張 {product.stock} 件
          </span>
        )}

        {/* Out of Stock Warning */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
            <AlertCircle className="w-8 h-8 text-[#bf2643] mb-1" />
            <span className="text-sm font-serif tracking-widest text-[#bf2643] font-bold">
              靈魂入庫 • 已售罄
            </span>
          </div>
        )}
      </div>

      {/* Content Block */}
      <div className="p-4 flex flex-col flex-1 border-t border-zinc-900 bg-zinc-950/40">
        <h3 className="text-base font-serif text-[#eae6e8] group-hover:text-white transition-colors duration-300 tracking-wide font-medium line-clamp-1">
          {product.name}
        </h3>
        
        {/* Short atmospheric story line */}
        <p className="text-xs text-zinc-500 font-serif leading-relaxed line-clamp-2 mt-1.5 flex-1 select-none">
          {product.story}
        </p>

        {/* Footer info: price and buy and details */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-900/60">
          <div>
            <span className="text-[10px] text-zinc-400 font-mono block tracking-widest uppercase">
              COVEN OFFER
            </span>
            <span className="text-base text-[#e0a899] font-mono tracking-wider font-semibold">
              TWD ${product.price.toLocaleString()}
            </span>
          </div>

          {!isOutOfStock && (
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="p-2.5 rounded-sm bg-zinc-900 hover:bg-[#801b30]/80 border border-zinc-800 hover:border-[#bf2643] text-zinc-300 hover:text-white transition-all duration-300 active:translate-y-px"
              id={`quick-add-${product.id}`}
              title="加入結社行囊"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
