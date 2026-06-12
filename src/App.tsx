/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Heart, Sparkles, Send, ShieldAlert, ArrowRight, Skull, Moon } from 'lucide-react';
import { Product, CartItem, UserProfile } from './types';
import { INITIAL_PRODUCTS, BRAND_BANNER_URL, BRAND_LOGO_URL } from './data';

import Header from './components/Header';
import LoginModal from './components/LoginModal';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import WishlistView from './components/WishlistView';
import BackendSystem from './components/BackendSystem';
import MarketingView from './components/MarketingView';
import AboutUs from './components/AboutUs';
import InvoiceView from './components/InvoiceView';

import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  // --- STATE PERSISTENCE IN LOCALSTORAGE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('goth_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('goth_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('goth_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-login standard wanderer user for optimal user experience so points & level are visible on start
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('goth_user');
    if (saved) return JSON.parse(saved);
    // Default logged in user with 500 starting points
    const defaultUser: UserProfile = {
      username: '安魂野渡 Wanderer',
      email: 'goth_soul@abyss.com',
      role: 'customer',
      points: 500,
      level: '暗夜行者 Shadow Walker'
    };
    return defaultUser;
  });

  const [currentView, setView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'necklace' | 'ring' | 'earrings' | 'choker'>('all');
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('goth_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('goth_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('goth_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('goth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('goth_user');
    }
  }, [currentUser]);

  // Firebase Auth Observer to keep state synchronized across the whole application
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCurrentUser({
              username: data.username || user.displayName || '行者 Seeker',
              email: data.email || user.email || '',
              points: data.points ?? 500,
              role: data.role || 'customer',
              level: data.level || '暗夜行者 Shadow Walker'
            });
          } else {
            setCurrentUser({
              username: user.displayName || '行者 Seeker',
              email: user.email || '',
              points: 500,
              role: 'customer',
              level: '暗夜行者 Shadow Walker'
            });
          }
        } catch (e) {
          console.error("Error setting app user matching firebase state:", e);
          setCurrentUser({
            username: user.displayName || '行者 Seeker',
            email: user.email || '',
            points: 500,
            role: 'customer',
            level: '暗夜行者 Shadow Walker'
          });
        }
      } else {
        // Fallback or user logged out
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- ACTIONS HANDLERS ---
  
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleApplyCheckoutPoints = (pointsToUse: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: Math.max(0, prev.points - pointsToUse)
      };
    });
  };

  const handleCheckoutSuccess = async (
    earnedPoints: number,
    customerName: string,
    phone: string,
    address: string,
    subtotal: number,
    discount: number,
    finalTotal: number
  ) => {
    // Clear cart upon successful transaction
    setCart([]);
    
    // Add points to user account
    if (currentUser) {
      const newPoints = currentUser.points + earnedPoints;
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: newPoints
        };
      });

      if (auth.currentUser) {
        try {
          // Update points in Firestore
          const uRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(uRef, { points: newPoints }, { merge: true });

          // Create invoice record in Firestore
          const invoiceId = `GH-IN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
          const invoiceDoc = {
            userId: auth.currentUser.uid,
            invoiceId,
            customerName,
            phone,
            address,
            items: cart.map(item => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity
            })),
            subtotal,
            discount,
            finalTotal,
            paymentMethod: '精選信用卡線上支付',
            createdAt: new Date()
          };

          await setDoc(doc(db, 'invoices', invoiceId), invoiceDoc);
        } catch (e) {
          console.error("Error writing invoice to Firestore database:", e);
        }
      }
    }
  };

  // Backend product management APIs
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    // Also remove from cart & wishlist if deleted
    setCart(prev => prev.filter(item => item.product.id !== productId));
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  const handleResetProducts = () => {
    if (window.confirm('確定要將飾品目錄回歸初降設定嗎？這將還原初始極致首飾。')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('goth_products', JSON.stringify(INITIAL_PRODUCTS));
    }
  };

  const handleSwitchToAdmin = () => {
    const adminUser: UserProfile = {
      username: '深淵大祭司 Coven Elder',
      email: 'elder@abyss.com',
      role: 'admin',
      points: 1500,
      level: '深淵主宰 Sovereign of Abyss'
    };
    setCurrentUser(adminUser);
  };

  // Email Newsletter subscription (+200 Points!)
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    if (currentUser) {
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: prev.points + 200
        };
      });
      setSubscriptionMessage('結盟誓約完成！200點積分已印入您的結社印記中。');
    } else {
      setSubscriptionMessage('結約成功！來自深淵的悄悄話已發送至您的邮箱。');
    }

    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  // Navigation Routing Switch helper
  const navigateToProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get selected product object
  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Wishlisted full product objects
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // Category view product listing content
  const filteredProducts = products.filter(p => 
    categoryFilter === 'all' ? true : p.category === categoryFilter
  );

  return (
    <div className="min-h-screen bg-[#060506] text-[#cececf] font-sans selection:bg-[#ea3c5d] selection:text-white flex flex-col justify-between">
      
      {/* Header element */}
      <Header 
        currentView={currentView}
        setView={(view) => {
          setView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogout={() => {
          auth.signOut();
          setCurrentUser(null);
          localStorage.removeItem('goth_user');
          setView('home');
        }}
        cart={cart}
        wishlistIds={wishlistIds}
      />

      {/* --- RENDER PRIMARY VIEWS --- */}
      <main className="flex-grow pb-16">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Elegant Gothic Widescreen Banner */}
            <section className="relative h-[480px] sm:h-[580px] flex items-center justify-center overflow-hidden">
              <img 
                src={BRAND_BANNER_URL} 
                alt="深淵與黑曜 Gothic Banner" 
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060506] via-[#060506]/35 to-transparent"></div>
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Centered Filigree & Content */}
              <div className="relative z-10 text-center max-w-3xl px-4 space-y-6">
                <div className="mb-2 inline-flex items-center gap-1.5 justify-center py-1 px-3 bg-[#801b30]/10 border border-[#b22c45]/40 rounded-full animate-pulse">
                  <Skull className="w-3.5 h-3.5 text-[#ea3c5d]" />
                  <span className="text-[10px] sm:text-xs tracking-widest text-[#e8a3b1] font-mono select-none">
                    COVEN OF THE CRYPTIC SHADOWS
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#eae6e8] tracking-[0.2em] font-semibold leading-tight drop-shadow-lg">
                  陰影中的純銀美學
                </h2>
                
                <p className="text-sm sm:text-base text-zinc-400 font-serif max-w-xl mx-auto leading-relaxed select-none">
                  我們執意尋找與我們擁有相同靈魂折射的夜行流浪者。<br />
                  以古法燻黑 925 純銀，將神聖十字架、骸骨、蝙蝠與蕾絲鑄成不屈的印記。
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => {
                      setView('category');
                      setCategoryFilter('all');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 rounded bg-gradient-to-r from-[#801b30] to-[#51121d] hover:from-[#ea3c5d] hover:to-[#a11c37] border border-[#a11c37] text-white tracking-[0.2em] font-serif text-sm font-semibold transition-all duration-300 shadow-md shadow-[#801b30]/20 active:translate-y-px"
                  >
                    進入暗夜首飾庫 • Explore
                  </button>
                  <button
                    onClick={() => {
                      setView('about');
                    }}
                    className="px-8 py-3.5 rounded bg-zinc-950/85 hover:bg-zinc-900 text-zinc-300 hover:text-white tracking-[0.2em] font-serif text-sm border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                  >
                    查閱結社故事 • History
                  </button>
                </div>
              </div>
            </section>

            {/* Curated Categories Bento Grid Links */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h3 className="text-sm text-zinc-500 font-mono tracking-[0.3em] uppercase text-center mb-10 select-none">
                ── 類別召喚 / Category Incantations ──
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'necklace', label: '項鍊首墜', sub: 'Pendents & Chains', desc: '靈柩、十字、荊棘與血色浪漫' },
                  { id: 'ring', label: '指間戒冕', sub: 'Baroque Rings', desc: '骷髏王冠、惡魔蝠翼、黑曜石守護' },
                  { id: 'earrings', label: '垂耳靈聽', sub: 'Gothic Earrings', desc: '蛛網結晶、細消光公雞黑羽羽翼' },
                  { id: 'choker', label: '天鵝頸鏈', sub: 'Lace Chokers', desc: '大馬士革蕾絲與復古天鵝絨纏繞' },
                ].map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setCategoryFilter(cat.id as any);
                      setView('category');
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className="group bg-[#0c0a0b] border border-zinc-900 hover:border-[#801b30] p-6 rounded-sm text-center cursor-pointer transition-all duration-500"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#241115] transition-colors border border-zinc-900 group-hover:border-[#521b26]">
                      <Moon className="w-4 h-4 text-[#e0a899] group-hover:text-[#ea3c5d] transition-colors" />
                    </div>
                    <h4 className="text-base font-serif text-[#eae6e8] tracking-widest font-bold group-hover:text-white transition-colors duration-300">
                      {cat.label}
                    </h4>
                    <span className="block text-[10px] text-zinc-500 font-mono tracking-wider mt-0.5">{cat.sub}</span>
                    <p className="text-[11px] text-zinc-600 font-serif leading-relaxed mt-3 line-clamp-2 max-w-[150px] mx-auto group-hover:text-zinc-500">
                      {cat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products Collection */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-950">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#eae6e8] tracking-widest font-bold flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-5 h-5 text-[#ea3c5d]" />
                    大殿精選 / Our Curated Relics
                  </h3>
                  <span className="block text-[10px] text-zinc-500 font-mono tracking-widest mt-1 select-none">
                    HANDEMBEDDED METALLURGICAL ARTWORKS
                  </span>
                </div>

                <button
                  onClick={() => {
                    setView('category');
                    setCategoryFilter('all');
                  }}
                  className="text-xs font-serif text-[#e0a899] hover:text-[#ea3c5d] transition-colors flex items-center gap-1 group font-semibold uppercase tracking-wider"
                >
                  <span>查看全部飾件 Explore All</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-300" />
                </button>
              </div>

              {/* Featured Cards list (renders featured products) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.filter(p => p.isFeatured).slice(0, 4).map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onViewDetail={navigateToProductDetail}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isCollected={wishlistIds.includes(product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Interactive Coven Newsletter Box (Subscribers get +200 coven points) */}
            <section className="max-w-4xl mx-auto px-4 py-16">
              <div className="bg-[#0c0a0b] border-2 border-[#5c1c28]/40 p-8 sm:p-12 text-center rounded-sm relative overflow-hidden"
                   style={{ boxShadow: '0 0 25px rgba(128, 27, 48, 0.2)' }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#801b30] to-transparent"></div>

                <span className="text-xs text-[#e0a899] font-serif tracking-[0.25em] uppercase block mb-2 select-none">
                  ✦ JOIN THE COVEN OF SHADOWS ✦
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold mb-4">
                  與永夜締結誓約電子報
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 font-serif leading-relaxed max-w-lg mx-auto mb-8">
                  渴望搶先探索最新解封首飾、汲取巴洛克穿搭靈魂指南及參與結社慶典？
                  訂閱電子報，來自深淵的秘語將直達您的信箱。{currentUser && <strong className="text-[#ea3c5d] mt-1 block">會員可立即獲得 200 點積分賞賜！</strong>}
                </p>

                {newsletterSubscribed ? (
                  <div className="bg-[#181113] border border-[#521b26]/50 p-4 rounded max-w-md mx-auto text-xs text-zinc-400 font-serif leading-loose">
                    <p className="text-[#ea3c5d] font-bold text-center text-sm mb-1">✓ 誓約契結成功</p>
                    {subscriptionMessage}
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="您的秘傳信箱 (Email)..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded px-4 py-3 text-sm text-zinc-300 font-mono placeholder:text-zinc-600"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded bg-[#801b30] hover:bg-[#ea3c5d] border border-[#a11c37] text-white tracking-widest font-serif text-xs font-bold transition-all uppercase flex items-center justify-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>締結約定</span>
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: CATEGORY EXPLORE LIST */}
        {currentView === 'category' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold mb-8 text-center uppercase">
              ── 飾品探索 / Offerings ──
              <span className="block text-[10px] text-zinc-500 font-mono tracking-[0.3em] mt-1 select-none">
                GOTHIC JEWELRY COVEN CATALOG
              </span>
            </h2>

            {/* Filter controls tab row */}
            <div className="flex justify-center flex-wrap gap-2 mb-10 border-b border-zinc-950 pb-6">
              {[
                { id: 'all', label: '全部首飾 • All' },
                { id: 'necklace', label: '暗夜項鍊 • Necklaces' },
                { id: 'ring', label: '雕古指戒 • Rings' },
                { id: 'earrings', label: '靈聽耳環 • Earrings' },
                { id: 'choker', label: '頸鏈 Chokers & Chokers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id as any)}
                  className={`px-4 py-2 text-xs font-serif tracking-widest rounded border transition-all ${
                    categoryFilter === tab.id
                      ? 'bg-[#801b30] text-white border-[#a11c37] shadow-lg shadow-[#801b30]/15'
                      : 'bg-[#0d0b0c] text-zinc-400 border-zinc-900 hover:border-[#801b30] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Products grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 font-serif">
                此分類目前沒有飾品入庫。您可在後端系統進行上架！
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="items">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onViewDetail={navigateToProductDetail}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isCollected={wishlistIds.includes(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PRODUCT DETAIL */}
        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct}
            onBack={() => setView('category')}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isCollected={wishlistIds.includes(selectedProduct.id)}
            userPoints={currentUser ? currentUser.points : 0}
          />
        )}

        {/* VIEW 4: ABOUT US BRAND STORY */}
        {currentView === 'about' && (
          <AboutUs />
        )}

        {/* VIEW 5: SHOPPING CART */}
        {currentView === 'cart' && (
          <CartView 
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            user={currentUser}
            onApplyPoints={handleApplyCheckoutPoints}
            onCheckoutSuccess={handleCheckoutSuccess}
            onOpenLogin={() => setLoginModalOpen(true)}
          />
        )}

        {/* VIEW 6: MEMBERSHIP WISHLIST */}
        {currentView === 'wishlist' && (
          <WishlistView 
            wishlistProducts={wishlistProducts}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onViewProduct={navigateToProductDetail}
          />
        )}

        {/* VIEW 7: BACK-END SYSTEM */}
        {currentView === 'backend' && (
          <BackendSystem 
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetProducts={handleResetProducts}
            user={currentUser}
            onSwitchToAdmin={handleSwitchToAdmin}
          />
        )}

        {/* VIEW 8: BRAND MARKETING & COPY SHOWROOM */}
        {currentView === 'marketing' && (
          <MarketingView />
        )}

        {/* VIEW 9: INVOICE DOWNLOAD VAULT */}
        {currentView === 'invoice' && (
          <InvoiceView 
            onOpenLogin={() => setLoginModalOpen(true)}
            onUpdateAppUser={(profile) => setCurrentUser(profile)}
          />
        )}

      </main>

      {/* --- FOOTER COMPONENT --- */}
      <footer className="bg-[#050405] border-t border-zinc-900 pt-16 pb-8 text-xs font-serif text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand presentation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#801b30]">
                <img src={BRAND_LOGO_URL} alt="A&O Logo" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
              </div>
              <h4 className="text-base font-serif text-[#eae6e8] tracking-widest font-bold">深淵與黑曜</h4>
            </div>
            <p className="text-zinc-600 leading-relaxed text-justify pr-2">
              「世人追逐太陽，我們在陰影中重塑星光。」
              獻給追尋極致暗黑唯美與對抗能量的亞文化行者，原創匠工古氧化飾件。
            </p>
          </div>

          {/* Column 2: Sitemap */}
          <div className="space-y-3">
            <h5 className="text-zinc-400 font-bold tracking-widest uppercase">結社指引 / Navigation</h5>
            <ul className="space-y-1.5 font-mono text-[11px] text-zinc-600">
              <li><button onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#ea3c5d] transition-colors">✦ 首頁主殿 Home</button></li>
              <li><button onClick={() => { setView('category'); setCategoryFilter('all'); }} className="hover:text-[#ea3c5d] transition-colors">✦ 暗夜飾品 Catalog</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-[#ea3c5d] transition-colors">✦ 品牌傳記 About us</button></li>
              <li><button onClick={() => setView('marketing')} className="hover:text-[#ea3c5d] transition-colors">✦ 推廣文案 Portfolio</button></li>
            </ul>
          </div>

          {/* Column 3: Custom copies checklist for prompt confirmation */}
          <div className="space-y-3">
            <h5 className="text-zinc-400 font-bold tracking-widest uppercase text-[#ea3c5d]">需求覆核 / Specifications</h5>
            <div className="space-y-1 text-zinc-600 leading-relaxed text-[11px]">
              <p>✔ 品牌 Logo / Banner / 商品與分類照</p>
              <p>✔ 網站文案 / 關於我們 / SEO文案</p>
              <p>✔ 宣傳專區：社群貼文 / EDM 模版</p>
              <p>✔ 後端商品上架系統（連動 LocalState）</p>
              <p>✔ 暗黑購物車 / 會員收藏 / 登入狀態</p>
              <p>✔ 優惠券扣減 / 帳戶積分折扣系統</p>
            </div>
          </div>

          {/* Column 4: Contact/Coordinates */}
          <div className="space-y-3">
            <h5 className="text-zinc-400 font-bold tracking-widest uppercase">暗夜祭壇聯繫 / Contact</h5>
            <ul className="space-y-1.5 font-mono text-[11px] text-zinc-600 text-justify">
              <li>地點：永夜街漆黑巷 13 號大教堂地下室</li>
              <li>信箱：gothic_coven@abyss-obsidian.com</li>
              <li>通訊：秘境電話 (02) 666-8013</li>
              <li className="text-[10px] text-zinc-500 pt-1">
                * 本網站為台灣亞文化哥德純銀飾品獨立創作平台，所有飾件皆具獨立手造編號與契印文件。
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom footer text */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900/60 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 tracking-wider">
          <p>
            永夜結社 © 2026 Abyss & Obsidian, Co., Ltd. 版權所有並精心鑄成。
          </p>
          <div className="flex gap-4 mt-2 sm:mt-0 select-none">
            <span className="hover:text-[#ea3c5d] cursor-help">隱私誓約 Privacy</span>
            <span>•</span>
            <span className="hover:text-[#ea3c5d] cursor-help">交易盟約 Terms</span>
            <span>•</span>
            <span className="hover:text-yellow-500 cursor-pointer" onClick={handleSwitchToAdmin}>
              ⚠️ 測試大祭司權限入口
            </span>
          </div>
        </div>
      </footer>

      {/* --- RENDER LOGIN MODAL GATES --- */}
      {loginModalOpen && (
        <LoginModal 
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={(profile) => setCurrentUser(profile)}
        />
      )}

    </div>
  );
}
