/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, ShieldCheck, Sparkles, AlertCircle, Quote, Compass } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (id: string) => void;
  isCollected: boolean;
  userPoints: number;
}

export default function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isCollected,
  userPoints
}: ProductDetailProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'necklace': return '項鍊';
      case 'ring': return '指戒';
      case 'earrings': return '耳環';
      case 'choker': return '頸鏈';
      default: return '經典飾品';
    }
  };

  const handleAddClick = () => {
    onAddToCart(product);
    setSuccessMessage('契印成功！已置入您的結社行囊。');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Return button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 group transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-serif tracking-widest uppercase">返回大殿 / 飾品探索</span>
      </button>

      {/* Main Container */}
      <div className="bg-[#0c0a0b] border border-zinc-800 rounded-sm overflow-hidden"
           style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)' }}>
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Column: Picture and zoom */}
          <div className="relative aspect-square w-full bg-zinc-950 flex items-center justify-center border-r border-zinc-800 p-4 sm:p-8">
            {/* Visual background decoration */}
            <div className="absolute inset-4 rounded border border-zinc-900 pointer-events-none"></div>
            
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover max-h-[550px] rounded-sm grayscale contrast-110 hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* Dark lace overlay filter */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>
          </div>

          {/* Right Column: Spec details */}
          <div className="p-6 sm:p-10 flex flex-col justify-between bg-zinc-950/20">
            <div>
              {/* Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#e0a899] uppercase tracking-[0.25em] font-mono border-b border-[#801b30] pb-1">
                  COVEN ARCHIVE // {getCategoryLabel(product.category)}系列
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  ID: {product.id.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-end gap-3 mb-6">
                <span className="text-2xl sm:text-3xl text-[#ea3c5d] font-mono tracking-wider font-semibold">
                  TWD ${product.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-1.5">
                  結社行囊代價 (含靈魂稅)
                </span>
              </div>

              {/* Separator */}
              <div className="border-t border-zinc-900 my-4"></div>

              {/* Material Detail */}
              <div className="mb-6">
                <h4 className="text-xs text-zinc-400 font-serif tracking-widest uppercase mb-2">配備材質 (Material Composition)</h4>
                <p className="text-sm text-zinc-300 bg-[#120f10] p-3 border-l-2 border-[#801b30] rounded-r-md font-serif leading-relaxed">
                  {product.material}
                </p>
              </div>

              {/* Main Description */}
              <div className="mb-6">
                <h4 className="text-xs text-zinc-400 font-serif tracking-widest uppercase mb-2">飾品解說 (Description)</h4>
                <p className="text-sm text-zinc-400 font-serif leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Points interaction preview */}
              <div className="bg-[#181113] border border-[#521b26]/50 p-3 rounded-md mb-6 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#e0a899] mt-0.5" />
                <div className="text-xs">
                  <span className="text-[#e0a899] font-serif font-semibold block">【結社會員特權】積分折抵預估</span>
                  <p className="text-zinc-500 font-serif mt-0.5">
                    此商品最多可全額使用積分抵折。您目前擁有 <strong className="text-white">{userPoints} 點</strong> 積分，結帳時可勾選折抵 <strong className="text-[#ea3c5d]">-${Math.min(userPoints, product.price)} TWD</strong>！
                  </p>
                </div>
              </div>

              {/* Coven Story Backside (Inspiration) */}
              <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-sm mb-6 relative">
                <Quote className="absolute top-2 right-2 w-10 h-10 text-zinc-900 pointer-events-none" />
                <h5 className="text-[10px] tracking-widest text-[#e0a899] font-mono mb-1.5 uppercase flex items-center gap-1">
                  <Compass className="w-3 h-3" /> 設計師靈魂手記 / Vibe Backstory
                </h5>
                <p className="text-xs text-zinc-500 font-serif italic leading-relaxed">
                  {product.story}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div>
              {successMessage && (
                <div className="mb-4 bg-emerald-950/40 border border-emerald-500 text-emerald-400 text-xs py-2 px-3 rounded text-center font-serif">
                  {successMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex-1 py-3 px-4 rounded border font-serif tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                    isCollected
                      ? 'bg-[#801b30]/10 border-[#bf2643] text-[#ea3c5d]'
                      : 'bg-[#120f10] hover:bg-[#241115] border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isCollected ? 'fill-[#ea3c5d] text-[#ea3c5d]' : ''}`} />
                  <span>{isCollected ? '已收集此暗夜印記' : '收藏此暗夜印記'}</span>
                </button>

                {/* Add To Cart Button */}
                {isOutOfStock ? (
                  <button
                    disabled
                    className="flex-[2] py-3 px-4 rounded bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed font-serif tracking-widest text-sm flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-[#bf2643]" />
                    <span>已隨魂飄折（售罄）</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddClick}
                    className="flex-[2] py-3 px-4 rounded bg-gradient-to-r from-[#801b30] to-[#51121d] hover:from-[#ea3c5d] hover:to-[#a11c37] border border-[#a11c37] text-white font-serif tracking-widest text-sm font-bold transition-all duration-300 shadow-xl shadow-[#801b30]/10 active:translate-y-px"
                  >
                    <ShoppingBag className="w-4 h-4 mr-1.5 inline" />
                    <span>置入我的結社行囊</span>
                  </button>
                )}
              </div>

              {/* Guarantee badges */}
              <div className="grid grid-cols-3 gap-2 mt-6 text-center text-[10px] text-zinc-500 font-serif border-t border-zinc-900 pt-4">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#e0a899] mb-1" />
                  <span>925 氧化防敏保證</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#e0a899] font-mono font-bold mb-1">COVEN</span>
                  <span>亞文化獨立原創</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#e0a899] font-mono font-bold mb-1">TWD</span>
                  <span>全球結社安全寄送</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Material Maintenance instructions row */}
      <div className="mt-8 bg-zinc-950/60 border border-zinc-900 rounded-sm p-6">
        <h3 className="text-sm font-serif text-[#e0a899] tracking-widest uppercase mb-3 text-center">
          ── 925 燻黑古銀飾品保養與儀式 ──
        </h3>
        <p className="text-xs text-zinc-500 font-serif leading-relaxed max-w-4xl mx-auto text-justify">
          深淵與黑曜
          的所有古銀飾品採用古法高溫硬化硫硫化處理，表面霧面深邃的黑色并非污垢，而是象徵歲月刻痕的永恆印記。
          建議您日常配戴完畢後，使用附贈的專屬天然麂皮擦拭布將汗漬擦乾，置於附屬的防潮首飾袋中隔絕空氣。
          請盡量避免戴著洗澡、泡溫泉或接觸香水噴霧等化學試劑，如此可保持氧化微光最完美、層次鮮明的黑銀對比。
        </p>
      </div>
    </div>
  );
}
