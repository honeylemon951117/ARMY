/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Trash2, Tag, Gift, Sparkles, Check, AlertCircle, Copy, CreditCard, ArrowRight } from 'lucide-react';
import { CartItem, Coupon, UserProfile } from '../types';
import { INITIAL_COUPONS } from '../data';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  user: UserProfile | null;
  onApplyPoints: (pointsToUse: number) => void;
  onCheckoutSuccess: (
    earnedPoints: number,
    customerName: string,
    phone: string,
    address: string,
    subtotal: number,
    discount: number,
    finalTotal: number
  ) => void;
  onOpenLogin: () => void;
}

export default function CartView({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  user,
  onApplyPoints,
  onCheckoutSuccess,
  onOpenLogin
}: CartViewProps) {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: user ? user.username : '',
    phone: '',
    address: '',
    paymentMethod: 'credit'
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Subtotal
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Apply Coupon
  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    
    // Find coupon
    const found = INITIAL_COUPONS.find(c => c.code === code || (code === 'GOTHIC10' && c.code === 'GOTHIC10'));
    if (!found) {
      // Hardcode fallbacks
      if (code === 'GOTHIC10') {
        const c10: Coupon = {
          code: 'GOTHIC10',
          discountType: 'percentage',
          value: 10,
          minSpend: 1000,
          description: '【暗黑初降】首購全店消費滿 TWD $1,000 即享 9 折。'
        };
        if (subtotal < c10.minSpend) {
          setCouponError(`未達最低消費金額 TWD $${c10.minSpend}`);
          return;
        }
        setActiveCoupon(c10);
        return;
      }
      setCouponError('此咒語（優惠券碼）無效，請重新確認。');
      setActiveCoupon(null);
      return;
    }

    if (subtotal < found.minSpend) {
      setCouponError(`未達此優惠券最低消費金額 TWD $${found.minSpend.toLocaleString()}`);
      setActiveCoupon(null);
      return;
    }

    setActiveCoupon(found);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setCouponCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Calculations
  let couponDiscount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      couponDiscount = Math.round(subtotal * (activeCoupon.value / 100));
    } else {
      couponDiscount = activeCoupon.value;
    }
  }

  const remainder = Math.max(0, subtotal - couponDiscount);
  const maxRedeemablePoints = user ? Math.min(user.points, remainder) : 0;
  
  const pointsDiscount = usePoints ? maxRedeemablePoints : 0;
  const finalTotal = Math.max(0, remainder - pointsDiscount);

  // Checkout submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!user) {
      onOpenLogin();
      return;
    }
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      alert('請填寫完整配送資料。');
      return;
    }

    // Award 10% points
    const earnedPoints = Math.round(subtotal * 0.1);
    
    // Deduct points if checked
    if (usePoints) {
      onApplyPoints(maxRedeemablePoints);
    }

    // Total discount combines coupons and points discount
    const totalDiscount = couponDiscount + pointsDiscount;

    // Process checkout
    onCheckoutSuccess(
      earnedPoints,
      checkoutForm.name,
      checkoutForm.phone,
      checkoutForm.address,
      subtotal,
      totalDiscount,
      finalTotal
    );
    setCheckoutComplete(true);
  };

  if (checkoutComplete) {
    const randomOrderId = `GOTH-${Math.floor(100000 + Math.random() * 900000)}`;
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="border-2 border-[#5c1c28] bg-[#0c0a0b] p-8 sm:p-12 rounded-sm"
             style={{ boxShadow: '0 0 40px rgba(128,27,48,0.3)' }}>
          <div className="w-16 h-16 rounded-full border border-[#bf2643] bg-[#241115] flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-[#ea3c5d]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold mb-3">
            祈願契約完成 • 正在發行商品
          </h2>
          <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mb-6">
            ORDER COMPLETED // ID: {randomOrderId}
          </p>

          <p className="text-sm text-zinc-400 font-serif leading-relaxed max-w-md mx-auto mb-8">
            親愛的暗夜流浪者 <strong className="text-[#e0a899]">{user?.username}</strong>，我們已接收到您的深淵交易。
            包裹預計將在 3-5 個夜暮交接之時由專人送達您的結社地點。
          </p>

          <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-md text-left max-w-md mx-auto mb-8 font-mono text-xs text-zinc-500 space-y-2">
            <p className="flex justify-between"><span>收件人：</span><span className="text-zinc-300">{checkoutForm.name}</span></p>
            <p className="flex justify-between"><span>聯絡電話：</span><span className="text-zinc-300">{checkoutForm.phone}</span></p>
            <p className="flex justify-between"><span>傳送地點：</span><span className="text-zinc-300 truncate max-w-[200px]">{checkoutForm.address}</span></p>
            <p className="flex justify-between"><span>支付代價：</span><span className="text-[#ea3c5d] font-bold">TWD ${finalTotal.toLocaleString()}</span></p>
            {usePoints && <p className="flex justify-between text-yellow-500"><span>古銀點數抵折：</span><span>-{maxRedeemablePoints} PTS</span></p>}
          </div>

          <div className="bg-[#181113] border border-[#521b26] p-4 rounded-md max-w-md mx-auto mb-8 flex items-center gap-3 text-left">
            <Sparkles className="w-5 h-5 text-[#ea3c5d] shrink-0" />
            <div>
              <span className="text-xs text-zinc-300 font-serif font-bold">靈魂印記獲得回饋：</span>
              <p className="text-[11px] text-zinc-500 font-serif mt-0.5">
                恭喜您完成本次結社大祭！獲得了本次交易額 10% 的積分回饋，共計增加了 <strong className="text-[#ea3c5d]">{Math.round(subtotal * 0.1)} 點</strong> 積分已注入您的會員印記！
              </p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded bg-gradient-to-r from-[#801b30] to-[#51121d] hover:from-[#ea3c5d] hover:to-[#a11c37] border border-[#a11c37] text-white tracking-widest font-serif text-sm transition-all"
          >
            返回神殿主頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold mb-8 text-center uppercase">
        ── 結社行囊 ──
        <span className="block text-[10px] text-zinc-500 font-mono tracking-[0.3em] mt-1 select-none">
          COVEN SHOPPING CART BAG
        </span>
      </h2>

      {cart.length === 0 ? (
        <div className="border border-zinc-800 bg-[#0d0b0c] p-12 text-center rounded-sm max-w-lg mx-auto">
          <ShoppingBag className="w-12 h-12 text-[#801b30] mx-auto mb-4" />
          <h3 className="text-lg font-serif text-zinc-300 font-medium mb-2">您的行囊空無一物</h3>
          <p className="text-xs text-zinc-500 font-serif mb-6 leading-relaxed">
            今夜的風穿堂而過，尚無飾件能與您的靈魄產生契合。
          </p>
          <a href="#items" onClick={() => window.location.reload()} className="px-6 py-2.5 rounded bg-zinc-900 hover:bg-[#801b30] text-white text-xs font-serif tracking-widest border border-zinc-800 transition-colors">
            前往大殿挑選飾物
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List (8 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs text-zinc-400 font-mono tracking-widest uppercase mb-4 pb-2 border-b border-zinc-900">
              揀選之物 / Selected Offerings ({cart.length})
            </h3>
            {cart.map((item) => (
              <div 
                key={item.product.id}
                className="flex gap-4 p-4 bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 rounded-sm transition-all relative"
              >
                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-sm overflow-hidden bg-zinc-900 border border-zinc-900">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-serif text-white font-medium line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1.5 line-clamp-1">
                      材質：{item.product.material.split('、')[0]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#141213] border border-zinc-800 rounded-sm">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors animate-pulse"
                      >
                        +
                      </button>
                    </div>

                    {/* Price total */}
                    <span className="text-sm font-semibold font-mono text-[#e0a899]">
                      TWD ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-[#ea3c5d] transition-colors"
                  title="丟棄此物"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Coupons section widget */}
            <div className="bg-[#0c0a0b] border border-zinc-900 p-4 rounded-sm mt-6">
              <h4 className="text-xs text-[#e0a899] font-serif tracking-widest uppercase mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#ea3c5d]" /> 可啟動之暗夜咒語 (結社優惠券)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INITIAL_COUPONS.map((cp) => (
                  <div 
                    key={cp.code}
                    className="bg-zinc-950 p-2.5 border border-dashed border-zinc-800 hover:border-[#801b30] rounded text-left transition-all"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs font-bold text-white tracking-widest bg-[#241115] px-1.5 py-0.5 rounded border border-[#801b30]">
                        {cp.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(cp.code)}
                        className="text-[10px] text-zinc-500 hover:text-[#ea3c5d] flex items-center gap-0.5"
                      >
                        {copiedCode === cp.code ? '已複製' : <><Copy className="w-2.5 h-2.5" /> 複製</>}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-serif leading-snug line-clamp-2">
                      {cp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Settlement (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0c0a0b] border border-zinc-800 p-6 rounded-sm"
                 style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
              <h3 className="text-sm font-serif text-[#eae6e8] tracking-widest font-bold pb-3 border-b border-zinc-900 mb-4 uppercase">
                代價結算 / Settlement
              </h3>

              {/* Login Check */}
              {!user && (
                <div className="bg-[#241115] p-3 rounded border border-[#521b26] mb-4 text-center">
                  <p className="text-xs text-zinc-400 font-serif leading-relaxed">
                    尚未偵測到您的結社身分！請登入以啟動您的 <strong className="text-white">500 點首購積分抵扣</strong> 與交易。
                  </p>
                  <button
                    onClick={onOpenLogin}
                    className="mt-2.5 bg-[#801b30] hover:bg-[#ea3c5d] text-white px-4 py-1.5 text-xs font-serif rounded tracking-widest transition-all"
                  >
                    立刻登錄結社身分
                  </button>
                </div>
              )}

              {/* Coupon input field */}
              <div className="mb-6">
                <label className="block text-xs text-zinc-400 font-serif mb-1.5 tracking-wider">輸入幽暗咒語 (優惠碼)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="例如首購: GOTHIC10"
                    className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded-sm px-3 py-2 text-xs font-mono text-zinc-300 uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-sm bg-zinc-900 hover:bg-[#801b30] border border-zinc-800 hover:border-[#bf2643] text-zinc-300 hover:text-white text-xs font-serif tracking-widest transition-colors duration-300"
                  >
                    契合
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-red-500 font-serif mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
                {activeCoupon && (
                  <p className="text-[11px] text-emerald-400 font-serif mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 已啟用優惠：{activeCoupon.description}
                  </p>
                )}
              </div>

              {/* Points subsystem checkbox */}
              {user && (
                <div className="bg-[#121011] border border-zinc-800 p-4 rounded-sm mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-300 font-serif font-semibold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-yellow-500" /> 會員積分抵扣
                    </span>
                    <span className="text-xs font-mono text-[#ea3c5d] font-bold">
                      {user.points} PTS
                    </span>
                  </div>
                  {user.points > 0 ? (
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={usePoints}
                        onChange={(e) => setUsePoints(e.target.checked)}
                        className="mt-0.5 accent-[#ea3c5d]"
                      />
                      <span className="text-[11px] text-zinc-400 font-serif leading-normal">
                        勾選此項，消耗帳戶點數抵扣現金。您目前可折抵 
                        <strong className="text-white mx-1">TWD ${maxRedeemablePoints}</strong> 元
                        {maxRedeemablePoints < user.points && <span className="text-[10px] text-zinc-500 block"> (本次訂單最多可以折抵至 0 元)</span>}
                      </span>
                    </label>
                  ) : (
                    <p className="text-[10px] text-zinc-500 font-serif leading-relaxed">
                      您的祭壇目前無可用積分，完成本次交易將獲得 10% 的點數反饋！
                    </p>
                  )}
                </div>
              )}

              {/* Bill analysis */}
              <div className="space-y-2 text-xs font-serif text-zinc-400">
                <div className="flex justify-between">
                  <span>飾品小計 Subtotal</span>
                  <span className="font-mono text-zinc-300">TWD ${subtotal.toLocaleString()}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-rose-500">
                    <span>【咒語折抵】{activeCoupon.code}</span>
                    <span className="font-mono">-TWD ${couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                {usePoints && (
                  <div className="flex justify-between text-yellow-500">
                    <span>【印記抵扣】使用 {pointsDiscount} 積分</span>
                    <span className="font-mono">-TWD ${pointsDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>結社運遞 Delivery</span>
                  <span className="text-[#e29578] tracking-widest font-bold">免運費 • Free</span>
                </div>

                <div className="border-t border-zinc-900 my-3 pt-3 flex justify-between text-sm">
                  <span className="text-[#eae6e8] font-bold">應付款項 Net Total</span>
                  <span className="text-lg font-mono font-bold text-[#ea3c5d]">
                    TWD ${finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Form fields */}
              <form onSubmit={handleCheckoutSubmit} className="mt-8 pt-6 border-t border-zinc-900 space-y-4">
                <h4 className="text-xs text-zinc-300 font-serif tracking-widest uppercase mb-2 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" /> 寄送神契與支付細節
                </h4>
                
                <div>
                  <label className="block text-[10px] text-zinc-500 font-serif mb-1">受寄行者 (姓名)</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm(e.target.value)}
                    placeholder="請輸入真實姓名"
                    className="w-full bg-[#141213] border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-xs text-zinc-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-serif mb-1">密訊通訊 (手機號碼)</label>
                  <input
                    type="tel"
                    required
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm(e.target.value)}
                    placeholder="如: 0912-345678"
                    className="w-full bg-[#141213] border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-xs text-zinc-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-serif mb-1">傳送地點 (配送地址)</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm(e.target.value)}
                    placeholder="請填寫完整配送地址"
                    className="w-full bg-[#141213] border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2 text-xs text-zinc-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-serif mb-1.5">獻祭方式 (付款管道)</label>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => setCheckoutForm({...checkoutForm, paymentMethod: 'credit'})}
                      className={`py-2 border rounded font-serif transition-colors ${
                        checkoutForm.paymentMethod === 'credit'
                          ? 'border-[#ea3c5d] bg-[#801b30]/20 text-[#ea3c5d]'
                          : 'border-zinc-800 text-zinc-400'
                      }`}
                    >
                      線上信用卡
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutForm({...checkoutForm, paymentMethod: 'remit'})}
                      className={`py-2 border rounded font-serif transition-colors ${
                        checkoutForm.paymentMethod === 'remit'
                          ? 'border-[#ea3c5d] bg-[#801b30]/20 text-[#ea3c5d]'
                          : 'border-zinc-800 text-zinc-400'
                      }`}
                    >
                      秘傳門戶轉帳
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded bg-gradient-to-r from-[#801b30] to-[#51121d] hover:from-[#ea3c5d] hover:to-[#a11c37] border border-[#a11c37] text-white tracking-[0.250em] font-serif text-sm font-bold transition-all duration-300 shadow-xl"
                >
                  確認大祭．召喚配送
                  <ArrowRight className="w-4 h-4 ml-1.5 inline" />
                </button>
              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
