/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Heart, User, Database, BookOpen, Share2, Eye, ShieldAlert, LogIn, LogOut } from 'lucide-react';
import { UserProfile, CartItem } from '../types';
import { BRAND_LOGO_URL } from '../data';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  user: UserProfile | null;
  onLoginClick: () => void;
  onLogout: () => void;
  cart: CartItem[];
  wishlistIds: string[];
}

export default function Header({
  currentView,
  setView,
  user,
  onLoginClick,
  onLogout,
  cart,
  wishlistIds
}: HeaderProps) {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/95 border-b border-[#312528] backdrop-blur-md shadow-2xl">
      {/* Upper Subtle Filigree/Ticker */}
      <div className="bg-[#241115] border-b border-[#3a1b21] py-1 text-center text-[10px] sm:text-xs tracking-[0.25em] text-[#e0a899] font-mono select-none uppercase">
        ✦ Coven of Shadows & Obsidian • 永夜結社大典：首購輸入「GOTHIC10」即享 9 折 ✦
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#801b30] group-hover:border-[#e03050] transition-colors duration-500 bg-black flex items-center justify-center">
              <img 
                src={BRAND_LOGO_URL} 
                alt="深淵與黑曜 Logo" 
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#801b30]/10 mix-blend-color group-hover:bg-transparent duration-500"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif text-[#eae6e8] tracking-[0.15em] font-bold group-hover:text-white transition-colors duration-300">
                深淵與黑曜
              </h1>
              <span className="block text-[8px] sm:text-[10px] text-[#a19799] tracking-[0.3em] font-mono group-hover:text-[#e0a899] transition-colors duration-300 uppercase">
                Abyss & Obsidian
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 text-sm">
            <button
              onClick={() => setView('home')}
              className={`px-4 py-2 rounded-sm font-medium tracking-widest transition-all duration-300 border-b-2 ${
                currentView === 'home'
                  ? 'text-[#ea3c5d] border-[#ea3c5d] bg-[#801b30]/10'
                  : 'text-[#d6c9cc] border-transparent hover:text-white hover:border-[#a08a90] hover:bg-white/5'
              }`}
            >
              首頁主殿
            </button>
            <button
              onClick={() => setView('category')}
              className={`px-4 py-2 rounded-sm font-medium tracking-widest transition-all duration-300 border-b-2 ${
                currentView === 'category'
                  ? 'text-[#ea3c5d] border-[#ea3c5d] bg-[#801b30]/10'
                  : 'text-[#d6c9cc] border-transparent hover:text-white hover:border-[#a08a90] hover:bg-white/5'
              }`}
            >
              暗夜飾品
            </button>
            <button
              onClick={() => setView('about')}
              className={`px-4 py-2 rounded-sm font-medium tracking-widest transition-all duration-300 border-b-2 ${
                currentView === 'about'
                  ? 'text-[#ea3c5d] border-[#ea3c5d] bg-[#801b30]/10'
                  : 'text-[#d6c9cc] border-transparent hover:text-white hover:border-[#a08a90] hover:bg-white/5'
              }`}
            >
              品牌故事
            </button>
            <button
              onClick={() => setView('marketing')}
              className={`px-4 py-2 rounded-sm font-medium tracking-widest transition-all duration-300 border-b-2 ${
                currentView === 'marketing'
                  ? 'text-[#ea3c5d] border-[#ea3c5d] bg-[#801b30]/10'
                  : 'text-[#d6c9cc] border-transparent hover:text-white hover:border-[#a08a90] hover:bg-white/5'
              }`}
            >
              宣傳文案櫥窗
            </button>
            <button
              onClick={() => setView('invoice')}
              className={`px-4 py-2 rounded-sm font-medium tracking-widest transition-all duration-300 border-b-2 ${
                currentView === 'invoice'
                  ? 'text-[#ea3c5d] border-[#ea3c5d] bg-[#801b30]/10'
                  : 'text-[#d6c9cc] border-transparent hover:text-white hover:border-[#a08a90] hover:bg-white/5'
              }`}
            >
              發票下載
            </button>
            <button
              onClick={() => setView('backend')}
              className={`px-4 py-2 rounded-sm font-medium tracking-widest transition-all duration-300 border-b-2 flex items-center gap-1.5 ${
                currentView === 'backend'
                  ? 'text-[#facc15] border-[#facc15] bg-yellow-500/10'
                  : 'text-[#cfa45d] border-transparent hover:text-[#facc15] hover:border-[#facc15]/50 hover:bg-yellow-500/5'
              }`}
            >
              <Database className="w-4 h-4" />
              後端上架
            </button>
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* User Login Indicator */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-[#ea3c5d] font-serif font-semibold tracking-wide">
                    {user.level}
                  </div>
                  <div className="text-xs text-[#eae6e8] font-medium">
                    {user.username} <span className="text-[10px] text-gray-500">({user.points} 積分)</span>
                  </div>
                </div>
                <div 
                  className="bg-[#241115] hover:bg-[#3d1920] border border-[#521b26] p-2.5 rounded-full text-[#ea3c5d] transition-all relative group cursor-pointer"
                  title="會員詳情與登出"
                  onClick={onLogout}
                >
                  <User className="w-4 h-4 sm:w-5 h-5" />
                  <span className="absolute -bottom-1 -right-1 bg-red-600 border border-black text-white text-[8px] font-mono px-1 rounded-full scale-0 group-hover:scale-100 transition-transform">
                    Out
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#801b30] hover:bg-[#ea3c5d] border border-[#a11c37] text-white text-xs sm:text-sm font-medium tracking-wider transition-all duration-300 shadow-md shadow-[#801b30]/20 active:translate-y-px"
                id="header-btn-login"
              >
                <LogIn className="w-4 h-4" />
                <span>登錄結社</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => setView('wishlist')}
              className={`p-2.5 rounded-full border border-zinc-800 transition-all cursor-pointer relative ${
                currentView === 'wishlist'
                  ? 'bg-[#801b30]/20 text-[#ea3c5d] border-[#ea3c5d]'
                  : 'bg-zinc-900/60 text-[#eae6e8] hover:bg-zinc-800 hover:text-rose-500'
              }`}
              title="我的收藏"
            >
              <Heart className={`w-4 h-4 sm:w-5 h-5 ${wishlistIds.length > 0 ? 'fill-[#ea3c5d] text-[#ea3c5d]' : ''}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ea3c5d] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#09090b]">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setView('cart')}
              className={`p-2.5 rounded-full border border-zinc-800 transition-all cursor-pointer relative ${
                currentView === 'cart'
                  ? 'bg-[#801b30]/20 text-[#ea3c5d] border-[#ea3c5d]'
                  : 'bg-zinc-900/60 text-[#eae6e8] hover:bg-zinc-800 hover:text-[#ea3c5d]'
              }`}
              title="結社行囊 (購物車)"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ea3c5d] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#09090b]">
                  {totalCartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile View Ticker Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-zinc-900 text-xs font-serif overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setView('home')}
            className={`px-3 py-1.5 transition-colors ${currentView === 'home' ? 'text-[#ea3c5d] font-bold' : 'text-zinc-400'}`}
          >
            首頁
          </button>
          <button
            onClick={() => setView('category')}
            className={`px-3 py-1.5 transition-colors ${currentView === 'category' ? 'text-[#ea3c5d] font-bold' : 'text-zinc-400'}`}
          >
            暗夜飾品
          </button>
          <button
            onClick={() => setView('about')}
            className={`px-3 py-1.5 transition-colors ${currentView === 'about' ? 'text-[#ea3c5d] font-bold' : 'text-zinc-400'}`}
          >
            品牌故事
          </button>
          <button
            onClick={() => setView('marketing')}
            className={`px-3 py-1.5 transition-colors ${currentView === 'marketing' ? 'text-[#ea3c5d] font-bold' : 'text-zinc-400'}`}
          >
            宣傳橱窗
          </button>
          <button
            onClick={() => setView('invoice')}
            className={`px-3 py-1.5 transition-colors ${currentView === 'invoice' ? 'text-[#ea3c5d] font-bold' : 'text-zinc-400'}`}
          >
            發票下載
          </button>
          <button
            onClick={() => setView('backend')}
            className={`px-3 py-1.5 transition-colors flex items-center gap-1 ${currentView === 'backend' ? 'text-[#facc15] font-bold' : 'text-[#cfa45d]'}`}
          >
            <Database className="w-3.5 h-3.5" />
            後端上架
          </button>
        </div>
      </div>
    </header>
  );
}
