/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Lock, Mail, Key, User, ArrowRight, ShieldAlert, 
  Download, Printer, CheckCircle, Skull, Sparkles, LogIn, ChevronRight, HelpCircle
} from 'lucide-react';
import { auth, db, googleProvider } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  doc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { UserProfile } from '../types';

interface InvoiceViewProps {
  onOpenLogin: () => void;
  onUpdateAppUser: (user: UserProfile | null) => void;
}

interface InvoiceItem {
  name: string;
  price: number;
  quantity: number;
}

interface InvoiceRecord {
  id: string;
  invoiceId: string;
  customerName: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  finalTotal: number;
  paymentMethod: string;
  createdAt: any;
}

export default function InvoiceView({ onOpenLogin, onUpdateAppUser }: InvoiceViewProps) {
  const [fUser, setFUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [fetchingInvoices, setFetchingInvoices] = useState(false);
  
  // Auth Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Selected Invoice for details/download
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  // Canvas Reference for JPG downloads
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadingImg, setDownloadingImg] = useState(false);

  // Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setFUser(user);
        // Load User Custom Profile from Firestore (Points, Levels)
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          let profile: UserProfile;
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            profile = {
              username: data.username || user.displayName || '行者 Seeker',
              email: data.email || user.email || '',
              points: data.points ?? 500,
              role: data.role || 'customer',
              level: data.level || '暗夜行者 Shadow Walker'
            };
          } else {
            // First time login - create custom profile
            profile = {
              username: user.displayName || '行者 Seeker',
              email: user.email || '',
              points: 500, // starting gift!
              role: 'customer',
              level: '暗夜行者 Shadow Walker'
            };
            await setDoc(userDocRef, profile);
          }
          
          onUpdateAppUser(profile);
          // Load User Invoices
          await fetchUserInvoices(user.uid);
        } catch (e) {
          console.error("Error synchronizing profile document:", e);
          // Fallback to local profile
          onUpdateAppUser({
            username: user.displayName || '行者 Seeker',
            email: user.email || '',
            points: 500,
            role: 'customer',
            level: '暗夜行者 Shadow Walker'
          });
        }
      } else {
        setFUser(null);
        setInvoices([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Invoices
  const fetchUserInvoices = async (userId: string) => {
    setFetchingInvoices(true);
    try {
      const q = query(collection(db, 'invoices'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const records: InvoiceRecord[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        records.push({
          id: docSnap.id,
          invoiceId: d.invoiceId || docSnap.id,
          customerName: d.customerName || '',
          phone: d.phone || '',
          address: d.address || '',
          items: d.items || [],
          subtotal: d.subtotal || 0,
          discount: d.discount || 0,
          finalTotal: d.finalTotal || 0,
          paymentMethod: d.paymentMethod || 'credit',
          createdAt: d.createdAt ? d.createdAt.toDate() : new Date()
        });
      });

      // Sort by date desc
      records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // If no invoices exist in database, let's create a beautiful GOTHIC DEMO invoice mock!
      if (records.length === 0) {
        const demoInvoiceId = `GH-IN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const demoDoc: any = {
          userId,
          invoiceId: demoInvoiceId,
          customerName: auth.currentUser?.displayName || '行者 Wanderer',
          phone: '0912-345-678',
          address: '幽暮街道 13 號城堡',
          items: [
            { name: '骸骨王冠指間戒冕', price: 1880, quantity: 1 },
            { name: '古法細消光十字項鍊', price: 2950, quantity: 1 }
          ],
          subtotal: 4830,
          discount: 483,
          finalTotal: 4347,
          paymentMethod: '信用卡支付',
          createdAt: new Date()
        };
        
        await setDoc(doc(db, 'invoices', demoInvoiceId), demoDoc);
        records.push({
          id: demoInvoiceId,
          ...demoDoc
        });
      }

      setInvoices(records);
      if (records.length > 0 && !selectedInvoice) {
        setSelectedInvoice(records[0]);
      }
    } catch (err) {
      console.error("Error retrieving invoice relics:", err);
    } finally {
      setFetchingInvoices(false);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    if (!email || !password) {
      setAuthError('請填寫完整帳號密碼。');
      setAuthLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (!username.trim()) {
          setAuthError('註冊行者請填送行者尊稱（用戶名）。');
          setAuthLoading(false);
          return;
        }
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fUser = userCredential.user;
        
        await updateProfile(fUser, {
          displayName: username
        });

        // Initialize user in Firestore
        const initialProfile = {
          username: username,
          email: email,
          points: 500, // Starting Gift Points!
          role: 'customer',
          level: '暗夜行者 Shadow Walker'
        };
        await setDoc(doc(db, 'users', fUser.uid), initialProfile);

        setAuthSuccess('深淵盟約結定！行者身分註冊成功，並獲得 500 點首簽積分！');
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
        setAuthSuccess('印記共鳴成功，您已重返永夜結社。');
      }
    } catch (e: any) {
      console.error("Authentication broken:", e);
      // Translate common errors
      if (e.code === 'auth/email-already-in-use') {
        setAuthError('此信箱業已與深淵締結誓約，請直接登錄。');
      } else if (e.code === 'auth/weak-password') {
        setAuthError('黑魔法防禦不足：密碼強度過低，建議 6 碼以上。');
      } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setAuthError('誓約信箋或黑魔法憑證（密碼）有誤，未能契合。');
      } else if (e.code === 'auth/user-not-found') {
        setAuthError('此信箱尚未與結社登記，請先切換至「註冊新帳號」。');
      } else {
        setAuthError(`契合失敗: ${e.message || '未知錯誤'}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const fUser = userCredential.user;
      
      // Initialize if not in DB
      const userDocRef = doc(db, 'users', fUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (!userDocSnapshot.exists()) {
        const initialProfile = {
          username: fUser.displayName || '行者 Seeker',
          email: fUser.email || '',
          points: 500, // Gift!
          role: 'customer',
          level: '暗夜行者 Shadow Walker'
        };
        await setDoc(userDocRef, initialProfile);
      }
      setAuthSuccess('Google 聯名印記接軌完畢，成功共振。');
    } catch (e: any) {
      console.error("Google Auth error:", e);
      if (e.code === 'auth/popup-blocked') {
        setAuthError('登入視窗被瀏覽器攔截，請允許彈出視窗，或使用帳密登錄。');
      } else {
        setAuthError(`Google 聯名登入失败: ${e.message || '未授權'}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Print Invoice Method
  const triggerPrint = () => {
    window.print();
  };

  // Canvas Generation and Image Download
  const generateAndDownloadInvoiceImage = () => {
    if (!selectedInvoice || !canvasRef.current) return;
    setDownloadingImg(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloadingImg(false);
      return;
    }

    // Set dimensions
    canvas.width = 600;
    canvas.height = 720;

    // Background Canvas Styling (Gothic Slate/Jet Theme)
    ctx.fillStyle = '#0e0c0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border Filigrees
    ctx.strokeStyle = '#5c1c28';
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    ctx.strokeStyle = '#801b30';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

    // Gothic Branding Info
    ctx.fillStyle = '#eae6e8';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('深淵與黑曜 • 交易神契發票', canvas.width / 2, 70);

    ctx.fillStyle = '#ea3c5d';
    ctx.font = '10px Courier New, monospace';
    ctx.fillText('✦ COVEN OF THE CRYPTIC SHADOWS • OFFICIAL INVOICE relic ✦', canvas.width / 2, 95);

    // Divider Line
    ctx.strokeStyle = '#3a2528';
    ctx.beginPath();
    ctx.moveTo(40, 115);
    ctx.lineTo(canvas.width - 40, 115);
    ctx.stroke();

    // Invoice Meta (Left column & Right Column)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a19799';
    ctx.font = '11px Courier New, monospace';
    ctx.fillText(`發票憑證 ID: ${selectedInvoice.invoiceId}`, 50, 145);
    ctx.fillText(`結約時間: ${selectedInvoice.createdAt.toLocaleString('zh-TW')}`, 50, 165);
    ctx.fillText(`傳送行者: ${selectedInvoice.customerName}`, 50, 185);
    ctx.fillText(`行者信箱: ${fUser?.email || 'seeker@abyss.com'}`, 50, 205);
    ctx.fillText(`配送位址: ${selectedInvoice.address}`, 50, 225);

    // Divider
    ctx.strokeStyle = '#3a2528';
    ctx.beginPath();
    ctx.moveTo(40, 245);
    ctx.lineTo(canvas.width - 40, 245);
    ctx.stroke();

    // Table Header
    ctx.fillStyle = '#e0a899';
    ctx.font = 'bold 12px Georgia, serif';
    ctx.fillText('首飾Relic名單', 50, 275);
    ctx.textAlign = 'center';
    ctx.fillText('數量', 380, 275);
    ctx.textAlign = 'right';
    ctx.fillText('單價 (TWD)', 460, 275);
    ctx.fillText('合計 (TWD)', 540, 275);

    // Items List
    let currentY = 305;
    ctx.font = '12px "Microsoft JhengHei", Arial, sans-serif';
    ctx.fillStyle = '#cececf';
    
    selectedInvoice.items.forEach((item) => {
      ctx.textAlign = 'left';
      ctx.fillText(item.name, 50, currentY);
      
      ctx.textAlign = 'center';
      ctx.font = '12px Courier New, monospace';
      ctx.fillText(String(item.quantity), 380, currentY);
      
      ctx.textAlign = 'right';
      ctx.fillText(`$${item.price.toLocaleString()}`, 460, currentY);
      ctx.fillText(`$${(item.price * item.quantity).toLocaleString()}`, 540, currentY);
      
      currentY += 30;
    });

    // Divider
    ctx.strokeStyle = '#2d1c1f';
    ctx.beginPath();
    ctx.moveTo(40, currentY);
    ctx.lineTo(canvas.width - 40, currentY);
    ctx.stroke();

    // Summary calculation blocks
    currentY += 30;
    ctx.textAlign = 'right';
    ctx.font = '12px Courier New, monospace';
    ctx.fillStyle = '#8e8688';
    ctx.fillText(`商品小計: TWD $${selectedInvoice.subtotal.toLocaleString()}`, 540, currentY);
    
    currentY += 25;
    ctx.fillStyle = '#801b30';
    ctx.fillText(`咒數折扣: -TWD $${selectedInvoice.discount.toLocaleString()}`, 540, currentY);
    
    currentY += 30;
    ctx.fillStyle = '#ea3c5d';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText(`應繳現款: TWD $${selectedInvoice.finalTotal.toLocaleString()}`, 540, currentY);

    // Footer Stamp
    currentY += 55;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#801b30';
    ctx.font = 'bold 11px Georgia, serif';
    ctx.fillText('✦ 深淵大祭司經手之契 ✦', canvas.width / 2, currentY);
    ctx.fillStyle = '#5c4e51';
    ctx.font = '9px Courier New, monospace';
    ctx.fillText('ABYSS & OBSIDIAN METALLURGY GUILD -- ALL RIGHTS RESERVED', canvas.width / 2, currentY + 20);

    // Fire actual download
    setTimeout(() => {
      try {
        const imageUri = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = `Abyss_Obsidian_Invoice_${selectedInvoice.invoiceId}.jpg`;
        link.href = imageUri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error("Canvas export failed:", e);
        alert('發票圖檔下載失敗，您可以直接列印此頁面。');
      } finally {
        setDownloadingImg(false);
      }
    }, 500);
  };

  // Switch SignUp mode
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setAuthError('');
    setAuthSuccess('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in print:bg-white print:text-black">
      
      {/* 1. PAGE LOADING */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-t-[#ea3c5d] border-[#241115] rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 font-serif text-sm">正在與深淵神契共振，請稍候...</p>
        </div>
      ) : !fUser ? (
        
        /* 2. AUTHENTICATION SHIELD GATE (Not Logged In) */
        <div className="max-w-4xl mx-auto py-8 print:hidden">
          
          {/* Aesthetic Intro Shield */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 rounded-full border-2 border-[#bf2643] bg-[#241115] flex items-center justify-center mb-4 relative shadow-lg shadow-[#801b30]/10">
              <Lock className="w-6 h-6 text-[#ea3c5d] animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-dashed border-[#ea3c5d]/40 animate-spin" style={{ animationDuration: '20s' }}></div>
            </div>
            
            <h2 className="text-3xl font-serif text-[#eae6e8] tracking-[0.2em] font-bold">
              本殿發票庫受結社防護
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-serif tracking-widest mt-2 select-none">
              COVEN ENCRYPTED RECORD INVOICE STORAGE VAULT
            </p>
            <p className="text-xs text-zinc-400 font-serif max-w-md mx-auto mt-4 leading-relaxed">
              親愛的行者，交易神契（電子發票下載）保存了您在深淵飾作的永恆交易印記。
              本頁面涉及個人與契稅資訊，<strong>必須先透過電子郵件和密碼登錄，或加入暗夜新帳號</strong> 始能授權取用。
            </p>
          </div>

          {/* Two Columns Grid: Auth Form (Left) & Value proposition (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-[#0c0a0b] border-2 border-[#5c1c28]/40 rounded-sm p-6 sm:p-10"
               style={{ boxShadow: '0 0 40px rgba(128, 27, 48, 0.2)' }}>
            
            {/* Left: Interactive FireBase Form */}
            <div className="md:col-span-7 space-y-6">
              
              <div className="flex border-b border-zinc-900 pb-3">
                <button
                  onClick={() => { setIsSignUp(false); setAuthError(''); }}
                  className={`flex-1 pb-2 text-xs sm:text-sm font-serif tracking-widest font-bold border-b-2 text-center transition-colors ${
                    !isSignUp ? 'border-[#ea3c5d] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  🔮 登入已有帳號 Seek In
                </button>
                <button
                  onClick={() => { setIsSignUp(true); setAuthError(''); }}
                  className={`flex-1 pb-2 text-xs sm:text-sm font-serif tracking-widest font-bold border-b-2 text-center transition-colors ${
                    isSignUp ? 'border-[#ea3c5d] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  ⚡ 註冊暗地新身分 Register
                </button>
              </div>

              {authError && (
                <div className="bg-[#241115] border border-red-900/60 p-3.5 rounded text-xs text-rose-400 font-serif leading-relaxed flex items-start gap-2 animate-shake">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-950/20 border border-emerald-950 p-3.5 rounded text-xs text-emerald-400 font-serif leading-relaxed flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* Username only for sign up */}
                {isSignUp && (
                  <div>
                    <label className="block text-xs text-zinc-400 font-serif mb-1.5 tracking-widest">
                      行者尊稱 (使用者名稱)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="請鍵入您在結社的稱號..."
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2.5 pl-10 text-xs text-zinc-300 font-serif"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs text-zinc-400 font-serif mb-1.5 tracking-widest">
                    結社信物聯絡信箱 (Email)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seeker@abyss.com"
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2.5 pl-10 text-xs text-zinc-300 font-mono"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs text-zinc-400 font-serif mb-1.5 tracking-widest">
                    黑魔法誓契密碼 (Password)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                      <Key className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="輸入您的結社密碼（至少 6 字元）"
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#ea3c5d] focus:outline-none rounded px-3 py-2.5 pl-10 text-xs text-zinc-300 font-mono"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded bg-gradient-to-r from-[#801b30] to-[#51121d] hover:from-[#ea3c5d] hover:to-[#a11c37] border border-[#a11c37] disabled:opacity-40 text-white tracking-[0.250em] font-serif text-xs font-bold transition-all uppercase flex items-center justify-center gap-1.5"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{isSignUp ? '簽署深淵誓約並創號' : '共鳴結印登入'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
                <span className="relative px-3 bg-[#0c0a0b] text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
                  OR UNION COVEN SIGN-IN
                </span>
              </div>

              {/* Google Log In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-serif tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              >
                {/* Google Icon Vector */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.14-5.136 4.14-3.41 0-6.177-2.767-6.177-6.177s2.767-6.177 6.177-6.177c1.47 0 2.82.52 3.886 1.385l3.05-3.05C18.91 2.455 15.776 1.31 12.24 1.31 6.335 1.31 1.5 6.145 1.5 12.05s4.835 10.74 10.74 10.74c6.23 0 10.422-4.38 10.422-10.59 0-.61-.06-1.2-.175-1.765l-10.247-.15z"/>
                </svg>
                <span>使用 Google 帳號安全登錄 / 註冊</span>
              </button>

            </div>

            {/* Right: Spec of why and coven policy banner */}
            <div className="md:col-span-5 bg-zinc-950/60 p-6 border border-zinc-900 rounded space-y-4 text-xs font-serif leading-relaxed text-zinc-500">
              <h4 className="text-sm font-bold text-[#e0a899] tracking-wider uppercase flex items-center gap-1">
                <Skull className="w-4 h-4 text-[#ea3c5d]" />
                永夜認證安全章程
              </h4>
              <p className="text-zinc-500 text-justify">
                《深淵與黑曜》極致純銀飾品館，均依照財政部電子發票實施辦法開立「雲端發票憑證」，並以嚴苛的 SSL/TLS 級別加密傳輸。
              </p>
              
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <div className="flex gap-2 items-start text-zinc-400">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                  <p><strong>初盟大賞 500 點：</strong>新創立並驗證帳號之會員立刻獲得 500 PTS 積分折抵額，立等即用。</p>
                </div>
                <div className="flex gap-2 items-start text-zinc-400">
                  <CheckCircle className="w-3.5 h-3.5 text-[#ea3c5d] shrink-0 mt-0.5" />
                  <p><strong>發票合規：</strong>支援載具、愛心捐贈等，提供合法規的 TWD 計價購買收據。</p>
                </div>
                <div className="flex gap-2 items-start text-zinc-400">
                  <Download className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p><strong>不限次下載：</strong>可列印成實體紀念契書或匯出高品質 Jpeg 圖片。</p>
                </div>
              </div>

              <div className="p-3 bg-[#241115]/40 border border-[#521b26]/30 text-[11px] text-zinc-500 leading-normal rounded">
                * 註腳：使用 Google 帳密登錄，或用 Email 自主辦理黑印帳號。全站首飾均可在購買後即時在此生成真實稅法發票。
              </div>
            </div>

          </div>
        </div>
      ) : (
        
        /* 3. LOGGED IN VIEW: INVOICES ARCHIVE & DOWNLOAD WORKSPACE */
        <div className="animate-fade-in">
          
          {/* Header Banner info */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0809] border border-zinc-900 p-6 rounded-md print:hidden">
            <div>
              <div className="flex items-center gap-2">
                <span className="py-0.5 px-2 bg-[#801b30]/20 border border-[#ea3c5d]/30 text-[#ea3c5d] text-[10px] font-mono tracking-widest rounded-full uppercase">
                  ACTIVE MEMBERSHIP
                </span>
                <span className="text-xs text-zinc-500 font-mono">UID: {fUser.uid.substring(0, 10)}...</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-widest mt-1.5">
                {fUser.displayName || '行者 Seeker'} 的深淵發票庫
              </h2>
              <p className="text-xs text-zinc-500 font-serif mt-1">
                已安全連結您的 925 純銀交易存摺。這裡記載著您在大殿的一切神聖奉獻（歷史發票）。
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  auth.signOut();
                  onUpdateAppUser(null);
                }}
                className="px-4 py-2 border border-zinc-800 hover:border-red-950 bg-zinc-950 hover:bg-red-950/15 text-zinc-500 hover:text-rose-400 text-xs font-serif tracking-widest rounded transition-all"
              >
                登出帳印 Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Invoice Lists column (Left, 4 Cols) */}
            <div className="lg:col-span-4 space-y-4 print:hidden">
              <h3 className="text-xs text-zinc-400 font-mono tracking-widest uppercase pb-2 border-b border-zinc-900">
                交易神契列表 / Invoice Records ({invoices.length})
              </h3>

              {fetchingInvoices ? (
                <div className="text-center py-10 text-zinc-500 text-xs">
                  讀取發票碑誌中...
                </div>
              ) : invoices.length === 0 ? (
                <div className="p-6 bg-[#0c0a0b] border border-zinc-900 text-center text-zinc-500 text-xs leading-loose font-serif">
                  您目前尚無購買紀錄！<br />
                  請前往「暗夜飾品」殿堂添置首飾，完成結帳後即可直接產生真正的發票！
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all ${
                        selectedInvoice?.invoiceId === inv.invoiceId
                          ? 'bg-[#181113] border-[#801b30]'
                          : 'bg-zinc-950/60 border-zinc-900 hover:border-[#bf2643]/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-xs font-bold text-[#e0a899]">
                          {inv.invoiceId}
                        </span>
                        <span className="text-[10px] text-[#ea3c5d] bg-[#801b30]/10 px-1.5 py-0.5 rounded border border-[#801b30]/30 font-mono">
                          TWD ${inv.finalTotal.toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">
                        結帳日付: {inv.createdAt.toLocaleDateString('zh-TW')}
                      </p>
                      
                      <div className="mt-2 text-[11px] text-zinc-400 font-serif truncate">
                        品項: {inv.items.map(it => `${it.name} x${it.quantity}`).join('、')}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-[#121112] border border-zinc-900 p-4 rounded text-xs text-zinc-500 leading-relaxed font-serif space-y-1">
                <span className="text-[#ea3c5d] font-bold block mb-1">💡 如何獲得新發票？</span>
                <p>1. 在「結社行囊」中，將心儀首飾加入購物車。</p>
                <p>2. 登錄帳密或 Google 會員身分以享有積點特惠。</p>
                <p>3. 送出訂單之後，發票將主動、即時登載並出現在本庫中，供您隨時調閱與下載。</p>
              </div>
            </div>

            {/* Selected Invoice Details workspace (Right, 8 Cols) */}
            <div className="lg:col-span-8">
              
              {!selectedInvoice ? (
                <div className="p-12 text-center border-2 border-dashed border-zinc-900 rounded text-zinc-500 font-serif text-sm">
                  請選擇左側發票標本以取用下載權限。
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Action buttons (Print/Download images) */}
                  <div className="flex flex-wrap justify-between items-center gap-3 bg-zinc-950/80 p-4 border border-zinc-900 rounded-md print:hidden">
                    <span className="text-xs text-zinc-400 font-serif">
                      正在檢閱發票: <strong className="text-white font-mono">{selectedInvoice.invoiceId}</strong>
                    </span>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={triggerPrint}
                        className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 hover:text-white bg-zinc-950 font-serif text-xs text-zinc-300 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>列印發票神契</span>
                      </button>

                      <button
                        onClick={generateAndDownloadInvoiceImage}
                        disabled={downloadingImg}
                        className="px-5 py-2 rounded bg-[#801b30] hover:bg-[#ea3c5d] border border-[#a11c37] font-serif text-xs text-white flex items-center gap-1.5 transition-all outline-none"
                      >
                        {downloadingImg ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>製圖下載中...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>下載高品質發票 (JPG)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* High fidelity printable gothic invoice paper */}
                  <div 
                    className="bg-[#0e0c0d] border-2 border-[#5c1c28] p-6 sm:p-10 rounded-sm relative text-[#cececf] shadow-xl overflow-hidden print:border-none print:p-0 print:bg-white print:text-black"
                    style={{
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    {/* Shadow overlay trim in web view, hidden during print */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#ea3c5d] print:hidden"></div>

                    {/* Skull emblem corner accent */}
                    <div className="absolute top-6 right-6 opacity-5 sm:opacity-10 pointer-events-none text-[#ea3c5d] print:hidden">
                      <Skull className="w-32 h-32" />
                    </div>

                    {/* Header */}
                    <div className="text-center pb-6 border-b border-zinc-900 print:border-zinc-300">
                      <h4 className="text-2xl font-serif text-[#eae6e8] tracking-[0.2em] font-bold print:text-black">
                        深淵與黑曜 • 交易神契發票
                      </h4>
                      <p className="text-[10px] text-[#ea3c5d] font-mono tracking-widest uppercase mt-1 print:text-[#801b30] select-none">
                        ✦ ABYSS & OBSIDIAN OFFICIAL INVOICE relic ✦
                      </p>
                      <p className="text-[9px] text-zinc-600 font-serif mt-1 print:text-zinc-500">
                        中華民國雲端交易證明文件 (亞文化哥德大殿專用計帳收據)
                      </p>
                    </div>

                    {/* Meta values */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 text-xs font-serif text-zinc-400 border-b border-zinc-900 print:border-zinc-300 print:text-zinc-700">
                      <div className="space-y-1.5">
                        <p><span className="text-zinc-600 print:text-zinc-500">發票憑證：</span><span className="text-white font-mono font-bold print:text-black">{selectedInvoice.invoiceId}</span></p>
                        <p><span className="text-zinc-600 print:text-zinc-500">核簽日付：</span><span className="font-mono">{selectedInvoice.createdAt.toLocaleString('zh-TW')}</span></p>
                        <p><span className="text-zinc-600 print:text-zinc-500">支付代價：</span><span className="font-mono text-[#e0a899] font-bold print:text-black">{selectedInvoice.paymentMethod}</span></p>
                      </div>
                      <div className="space-y-1.5">
                        <p><span className="text-zinc-600 print:text-zinc-500">契合行者：</span><span className="text-zinc-300 print:text-black">{selectedInvoice.customerName}</span></p>
                        <p><span className="text-zinc-600 print:text-zinc-500">行者信箱：</span><span className="font-mono">{fUser.email}</span></p>
                        <p><span className="text-zinc-600 print:text-zinc-500">配運位址：</span><span className="text-zinc-300 print:text-zinc-700 truncate block sm:inline-block max-w-[200px]" title={selectedInvoice.address}>{selectedInvoice.address}</span></p>
                      </div>
                    </div>

                    {/* Item list table */}
                    <div className="py-6">
                      <h5 className="text-xs text-[#e0a899] tracking-widest font-bold uppercase mb-4 print:text-black">
                        首飾清冊 List of reliquaries
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-serif">
                          <thead>
                            <tr className="border-b border-zinc-800 text-zinc-500 print:border-zinc-300 print:text-zinc-600 pb-2">
                              <th className="font-bold py-2">首飾名稱 Relic Artwork</th>
                              <th className="font-bold text-center py-2">數量 Qty</th>
                              <th className="font-bold text-right py-2">單價 Unit Price</th>
                              <th className="font-bold text-right py-2">合計 Net Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900/60 print:divide-zinc-200">
                            {selectedInvoice.items.map((item, idx) => (
                              <tr key={idx} className="text-zinc-300 print:text-black">
                                <td className="py-3 pr-4 font-serif text-[#eae6e8] print:text-black">
                                  {item.name}
                                </td>
                                <td className="py-3 text-center font-mono">
                                  {item.quantity}
                                </td>
                                <td className="py-3 text-right font-mono text-zinc-400 print:text-zinc-700">
                                  TWD ${item.price.toLocaleString()}
                                </td>
                                <td className="py-3 text-right font-mono text-[#e0a899] font-bold print:text-black">
                                  TWD ${(item.price * item.quantity).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Summary math block */}
                    <div className="pt-4 border-t border-zinc-900 print:border-zinc-300 flex flex-col items-end gap-1.5 text-xs font-serif text-zinc-500 print:text-zinc-600">
                      <p>
                        <span>購買小計 Subtotal:</span>
                        <span className="font-mono text-zinc-400 ml-3 print:text-black">TWD ${selectedInvoice.subtotal.toLocaleString()}</span>
                      </p>
                      <p className="text-rose-500 print:text-[#801b30]">
                        <span>咒語抵減 Coupon Discount:</span>
                        <span className="font-mono ml-3">-TWD ${selectedInvoice.discount.toLocaleString()}</span>
                      </p>
                      <p className="text-xs text-zinc-400 print:text-zinc-500">
                        <span>運遞費用 Carriage:</span>
                        <span className="font-mono ml-3 text-emerald-400 font-bold">免運費 • Free</span>
                      </p>
                      <p className="text-sm text-white print:text-black font-bold pt-2 border-t border-zinc-900 print:border-zinc-200 mt-2.5">
                        <span className="text-[#ea3c5d] print:text-black mr-2">總計貢獻金 Net Payment:</span>
                        <span className="font-mono text-lg text-[#ea3c5d] print:text-black bg-[#241115]/40 px-2 py-0.5 border border-[#801b30]/30 rounded print:border-none print:p-0">
                          TWD ${selectedInvoice.finalTotal.toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Bottom stamps */}
                    <div className="mt-10 pt-6 border-t border-zinc-900/40 text-center flex flex-col items-center justify-center gap-1.5 print:border-zinc-200">
                      <div className="w-12 h-12 rounded-full border border-[#801b30]/60 bg-[#12080a] flex items-center justify-center text-[#ea3c5d] opacity-50 print:border-black print:text-black">
                        <Skull className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] text-zinc-500 tracking-wider font-serif print:text-zinc-600 select-none">
                        ✦ 經手大祭司：深淵與黑曜結社掌權契印 ✦
                      </p>
                      <p className="text-[8px] text-zinc-600 font-mono tracking-widest print:text-zinc-400">
                        OBSIDIAN ABYSS SACRED COMMERCE SEAL -- VERIFIED SYSTEM
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* Invisible Canvas used to render and export JPEGs - Web representation only */}
      <canvas ref={canvasRef} className="hidden" />

    </div>
  );
}
