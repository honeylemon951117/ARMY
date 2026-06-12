/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Plus, Trash2, ArrowLeft, RotateCcw, AlertTriangle, Check, SlidersHorizontal, Image, Lock } from 'lucide-react';
import { Product, UserProfile } from '../types';

interface BackendSystemProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  user: UserProfile | null;
  onSwitchToAdmin: () => void;
}

export default function BackendSystem({
  products,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  user,
  onSwitchToAdmin
}: BackendSystemProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'necklace' | 'ring' | 'earrings' | 'choker'>('necklace');
  const [formPrice, setFormPrice] = useState(1980);
  const [formMaterial, setFormMaterial] = useState('925 燻黑純銀、防禦黑曜石、手拋精飾');
  const [formDescription, setFormDescription] = useState('這是一件精美的哥特亞文化首飾，以暗黑、神秘、巴洛克美學為導向設計。');
  const [formStory, setFormStory] = useState('來自深淵底層的神秘低語，指針在午夜十二點停擺之瞬鑄成。');
  const [formStock, setFormStock] = useState(10);
  const [formImage, setFormImage] = useState('/src/assets/images/gothic_product_pendant_1781232388407.jpg');

  // Preselected images for easy drop down selection
  const imagePresets = [
    { label: '棺柩玫瑰墜飾 (Generated)', value: '/src/assets/images/gothic_product_pendant_1781232388407.jpg' },
    { label: '邪蝠黑曜古戒 (Generated)', value: '/src/assets/images/gothic_product_ring_1781232399433.jpg' },
    { label: '蛛網結晶淚耳環 (Generated)', value: '/src/assets/images/gothic_product_earrings_1781232410364.jpg' },
    { label: '倒十字尖塔頸鏈 (Generated)', value: '/src/assets/images/gothic_product_choker_1781232425469.jpg' },
    { label: '手作古銅戒 (Classic)', value: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop' },
    { label: '歐巴洛克珍珠鏈 (Classic)', value: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop' },
    { label: '消光黑色羽流蘇 (Classic)', value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
    { label: '全植鞣牛皮鉚釘鏈 (Classic)', value: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMaterial.trim() || !formDescription.trim()) {
      alert('請填妥前四項核心資訊。');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      material: formMaterial,
      description: formDescription,
      story: formStory,
      stock: Number(formStock),
      image: formImage
    };

    onAddProduct(newProduct);
    setSuccessMsg(`【${formName}】已順利灌注魔力並成功上架前台！`);
    
    // Reset form fields lightly
    setFormName('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const isAdmin = user && user.role === 'admin';

  // If not Admin, display elegant gatekeeper barrier
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in">
        <div className="border border-yellow-600/40 bg-[#0c0a0b] p-8 sm:p-12 rounded-sm text-center"
             style={{ boxShadow: '0 0 30px rgba(234, 179, 8, 0.15)' }}>
          <div className="w-16 h-16 rounded-full border border-yellow-500/30 bg-yellow-500/5 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#eae6e8] tracking-widest font-bold mb-3">
            深淵執事殿堂 • 權限封鎖
          </h2>
          <p className="text-xs text-yellow-500 font-mono tracking-widest uppercase mb-6">
            ADMINISTRATOR ACCESS LOCKED // COVEN SECURITY FIRST
          </p>

          <p className="text-sm text-zinc-400 font-serif leading-relaxed max-w-md mx-auto mb-8">
            您目前的登錄身分為{user ? `【${user.username}】` : '匿名行者'} 屬一般客群，尚未得到「結社執事」授權，無法進入後台進行產品上架、修改及銷毀。
          </p>

          <div className="bg-zinc-950 p-4 rounded-sm max-w-sm mx-auto mb-8 border border-zinc-900 border-l-4 border-yellow-500 text-left">
            <span className="text-xs font-serif font-bold text-yellow-500 block">執事職責包含：</span>
            <ul className="list-disc list-inside text-[11px] text-zinc-500 font-serif space-y-1.5 mt-2">
              <li>手作氧化飾件灌注並登載前台資料</li>
              <li>調控飾品庫存及限制配送祭壇</li>
              <li>審核幽暗優惠咒語 (Coupons)</li>
              <li>重置展示前台飾品目錄</li>
            </ul>
          </div>

          <button
            onClick={onSwitchToAdmin}
            className="px-6 py-3 rounded bg-yellow-500/10 hover:bg-yellow-500 hover:text-black border border-yellow-500 text-yellow-500 font-serif text-xs px-6 tracking-widest font-bold transition-all duration-300"
            id="backend-auth-bypass-btn"
          >
            🔮 聖權委任：切換為大祭司執事 (Admin)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-zinc-300">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-zinc-900 mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold uppercase flex items-center gap-2">
            <Database className="w-7 h-7 text-yellow-500" />
            深淵後端上架商品系統
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1 select-none">
            DARK METALLURGY INVENTORY MANAGEMENT PANEL
          </p>
        </div>

        {/* Restore defaults */}
        <button
          onClick={onResetProducts}
          className="flex items-center gap-1.5 text-xs font-serif bg-zinc-900 hover:bg-red-950 px-4  py-2.5 rounded border border-zinc-800 hover:border-red-800 transition-all text-zinc-400 hover:text-white"
          title="回歸最初的商品目錄"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>重設前台首飾目錄</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Register Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0c0a0b] border border-zinc-800 p-6 rounded-sm">
          <h3 className="text-base font-serif text-[#eae6e8] tracking-widest font-bold mb-4 uppercase text-yellow-500 flex items-center gap-1.5 pb-2 border-b border-zinc-900/60">
            <Plus className="w-5 h-5" /> 灌注儀式：登載全新首飾 / Add Offering
          </h3>

          {successMsg && (
            <div className="mb-6 bg-emerald-950/55 text-emerald-400 border border-emerald-500 p-3 rounded text-xs font-serif flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-serif">
            
            {/* Title / Name */}
            <div>
              <label className="block text-zinc-400 mb-1 tracking-wider">首飾封號 (商品名稱)*</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="例如：骸骨十字燻黑流蘇項鍊"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-zinc-200"
              />
            </div>

            {/* Row category/price/stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1 tracking-wider">飾品分類*</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-zinc-200"
                >
                  <option value="necklace">項鍊 Necklace</option>
                  <option value="ring">指戒 Ring</option>
                  <option value="earrings">耳環 Earrings</option>
                  <option value="choker">頸鏈 Choker</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 tracking-wider">兌換代價 (TWD 售價)*</label>
                <input
                  type="number"
                  required
                  min="100"
                  max="50000"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-zinc-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 tracking-wider">初始祭祀存庫 (庫存數量)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-zinc-200 font-mono"
                />
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-zinc-400 mb-1 tracking-wider">極致材質 (Material Composition)*</label>
              <input
                type="text"
                required
                value={formMaterial}
                onChange={(e) => setFormMaterial(e.target.value)}
                placeholder="如：925燻黑純銀、奧地利琢面水晶"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-zinc-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-zinc-400 mb-1 tracking-wider">商品介紹文案 (Product Description)*</label>
              <textarea
                required
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-[#a39fa2] leading-relaxed"
                placeholder="關於飾品細節、工裝雕花、巴洛克設計的敘述..."
              />
            </div>

            {/* Story / Backstory */}
            <div>
              <label className="block text-zinc-400 mb-1 tracking-wider">設計師靈感故事 / Gothic Vibe Backstory*</label>
              <textarea
                required
                rows={2}
                value={formStory}
                onChange={(e) => setFormStory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-zinc-500 italic"
                placeholder="為這款首飾編織一個優雅、唯美抑或反叛的故事...讓客戶更沉浸。"
              />
            </div>

            {/* Image selection / Copy URL */}
            <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-sm">
              <label className="block text-[#e0a899] font-semibold mb-2 flex items-center gap-1">
                <Image className="w-4 h-4" /> 點選預設商品實拍圖 (推薦) 或自定義圖片位址
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {imagePresets.map((pr) => (
                  <button
                    key={pr.value}
                    type="button"
                    onClick={() => setFormImage(pr.value)}
                    className={`p-1.5 rounded border text-[10px] text-zinc-400 font-mono truncate text-left transition-all ${
                      formImage === pr.value
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 font-bold'
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="可手動貼入任何圖片 URL"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-500 focus:outline-none rounded px-3 py-2 text-zinc-300 font-mono text-[11px]"
              />
            </div>

            {/* Action button */}
            <button
              type="submit"
              className="w-full py-3 rounded bg-[#cfa45d] hover:bg-yellow-500 text-black tracking-[0.2em] font-bold text-xs uppercase cursor-pointer transition-all duration-300 shadow-md active:translate-y-px"
            >
              ✦ 降魔鑄銀．登錄上架 ✦
            </button>
          </form>
        </div>

        {/* Right Column: Mini Inventory Manager (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          <div className="bg-[#0c0a0b] border border-zinc-800 p-6 rounded-sm flex-1">
            <h3 className="text-base font-serif text-[#eae6e8] tracking-widest font-bold mb-4 uppercase text-yellow-500 flex items-center gap-1.5 pb-2 border-b border-zinc-900/60">
              <SlidersHorizontal className="w-5 h-5" /> 飾名簿管理 ({products.length} 款首飾)
            </h3>

            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
              {products.map((p) => (
                <div 
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-900/80 hover:border-zinc-800 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-10 h-10 object-cover rounded-sm grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-serif text-white font-medium block truncate max-w-[150px]">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {p.category.toUpperCase()} • TWD ${p.price.toLocaleString()} • 庫存:{p.stock}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 focus:outline-none rounded transition-all"
                    title="刪除此首飾"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Admin safety code instructions */}
            <div className="mt-8 bg-zinc-950 p-4 border border-yellow-500/10 rounded text-[11px] font-serif leading-relaxed text-zinc-500">
              <div className="flex items-center gap-1.5 text-yellow-500 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>後端與前台同步安全守則</span>
              </div>
              後端系統已透過 React State 與 LocalStorage 深度聯動。在此處進行上架與刪除，前台的所有【暗夜飾品】、【分類篩選】以及【精選商品】均會立即實時响应同步變動。
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
