/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShoppingCart, Trash2, LayoutGrid, Eye } from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (productId: string) => void;
}

export default function WishlistView({
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onViewProduct
}: WishlistViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold mb-8 text-center uppercase">
        ── 會員收藏印記 ──
        <span className="block text-[10px] text-zinc-500 font-mono tracking-[0.3em] mt-1 select-none">
          MEMBER WISHLIST COVEN SIGN
        </span>
      </h2>

      {wishlistProducts.length === 0 ? (
        <div className="border border-zinc-800 bg-[#0d0b0c] p-12 text-center rounded-sm max-w-lg mx-auto">
          <Heart className="w-12 h-12 text-[#801b30] mx-auto mb-4" />
          <h3 className="text-lg font-serif text-zinc-300 font-medium mb-2 font-bold">尚無鐫刻印記</h3>
          <p className="text-xs text-zinc-500 font-serif mb-6 leading-relaxed">
            您目前沒有收藏任何首飾。點擊首頁或飾品探索頁的愛心，在此印刻留下您的神職感召物。
          </p>
          <a href="#items" onClick={() => window.location.reload()} className="px-6 py-2.5 rounded bg-zinc-900 hover:bg-[#801b30] text-white text-xs font-serif tracking-widest border border-zinc-800 transition-colors">
            前往解封首飾
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <div 
                key={product.id}
                className="group bg-[#0e0c0d] border border-zinc-800 hover:border-[#801b30] rounded-sm overflow-hidden flex flex-col relative transition-all duration-300"
              >
                {/* Image Block */}
                <div className="relative aspect-square w-full overflow-hidden bg-zinc-950">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-opacity hover:opacity-95 duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Delete button from collections */}
                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/85 hover:bg-[#801b30] border border-zinc-900 text-zinc-500 hover:text-white transition-colors"
                    title="移除此收藏"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content Block */}
                <div className="p-4 flex flex-col flex-1 bg-zinc-950/40">
                  <span className="text-[10px] text-[#e0a899] font-mono tracking-widest uppercase mb-1">
                    {product.category.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-serif text-zinc-300 font-medium tracking-wide line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="text-sm text-[#e0a899] font-mono font-semibold mb-4">
                    TWD ${product.price.toLocaleString()}
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={() => onViewProduct(product.id)}
                      className="py-1.5 rounded border border-zinc-800 hover:border-[#801b30] bg-[#141213] text-zinc-400 hover:text-white text-xs font-serif tracking-widest flex items-center justify-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>查看詳情</span>
                    </button>
                    {!isOutOfStock ? (
                      <button
                        onClick={() => onAddToCart(product)}
                        className="py-1.5 rounded bg-[#801b30] hover:bg-red-700 text-white text-xs font-serif tracking-widest flex items-center justify-center gap-1 transition-all shadow-md shadow-[#801b30]/10"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>置入行囊</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="py-1.5 rounded bg-zinc-900 text-zinc-600 text-xs font-serif tracking-widest cursor-not-allowed text-center"
                      >
                        已售罄
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
