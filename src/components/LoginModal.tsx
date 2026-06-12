/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, Mail, Key, User, Lock } from 'lucide-react';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const syncUserProfile = async (uid: string, userEmail: string, userDisplayName?: string | null) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      let profile: UserProfile;

      if (userDoc.exists()) {
        const data = userDoc.data();
        profile = {
          username: data.username || userDisplayName || '行者 Wanderer',
          email: data.email || userEmail || '',
          points: data.points ?? 500,
          role: data.role || 'customer',
          level: data.level || '暗夜行者 Shadow Walker'
        };
      } else {
        profile = {
          username: userDisplayName || '行者 Wanderer',
          email: userEmail || '',
          points: 500,
          role: 'customer',
          level: '暗夜行者 Shadow Walker'
        };
        await setDoc(userDocRef, profile);
      }
      onLoginSuccess(profile);
      setSuccessMsg('結印契合！身分已安全對接。');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (e) {
      console.error("Error fetching/setting user profile metadata:", e);
      // fallback
      const fallback: UserProfile = {
        username: userDisplayName || '行者 Wanderer',
        email: userEmail,
        points: 500,
        role: 'customer',
        level: '暗夜行者 Shadow Walker'
      };
      onLoginSuccess(fallback);
      onClose();
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('請填寫完整信箱密碼。');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (!username.trim()) {
          setErrorMsg('請提供您的行者尊稱。');
          setLoading(false);
          return;
        }

        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const fUser = credential.user;
        await updateProfile(fUser, { displayName: username });
        await syncUserProfile(fUser.uid, email, username);
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const fUser = credential.user;
        await syncUserProfile(fUser.uid, email, fUser.displayName);
      }
    } catch (e: any) {
      console.error("Firebase auth modal error:", e);
      if (e.code === 'auth/email-already-in-use') {
        setErrorMsg('此信箱業已結社在案，請直接登入。');
      } else if (e.code === 'auth/weak-password') {
        setErrorMsg('黑魔法防禦不足：密碼長度建議大於 6 字元。');
      } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setErrorMsg('信件或密碼與結社檔案不符，共鳴失敗。');
      } else {
        setErrorMsg(`契契失敗: ${e.message || '請確認信箱密碼格式。'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const fUser = credential.user;
      await syncUserProfile(fUser.uid, fUser.email || '', fUser.displayName);
    } catch (e: any) {
      console.error("Firebase Google auth modal error:", e);
      setErrorMsg(`Google 登入失敗: ${e.message || '未授權'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0e0c0d] border-2 border-[#5c1c28] rounded-lg shadow-2xl p-6 overflow-hidden"
        style={{
          boxShadow: '0 0 30px rgba(128, 27, 48, 0.4)'
        }}
        id="login-modal-panel"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ea3c5d] to-transparent"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-[#ea3c5d] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full border border-[#bf2643] bg-[#241115] flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-[#ea3c5d]" />
          </div>
          <h2 className="text-2xl font-serif text-[#eae6e8] tracking-widest font-bold">
            {isSignUp ? '加入永夜結社' : '永夜結社．身分登錄'}
          </h2>
          <span className="block text-[10px] text-zinc-500 tracking-[0.2em] font-mono mt-1 select-none">
            {isSignUp ? 'JOIN COVEN' : 'SIGN IN / COVEN COMMUNION'}
          </span>
        </div>

        {errorMsg && (
          <div className="bg-[#241115] border border-red-900/60 p-3 mb-4 rounded text-xs text-rose-400 font-serif flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/20 border border-emerald-950 p-3 mb-4 rounded text-xs text-emerald-400 font-serif flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-xs text-zinc-400 font-serif tracking-widest mb-1">
                行者尊稱 (使用者名稱)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-[#141213] border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded-md py-2.5 pl-10 pr-4 text-sm text-zinc-200"
                  placeholder="請輸入您的暗夜代名..."
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs text-zinc-400 font-serif tracking-widest mb-1">
              結社信箋 (電子信箱)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#141213] border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded-md py-2.5 pl-10 pr-4 text-sm text-zinc-200 font-mono"
                placeholder="shadow@abyss.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-zinc-400 font-serif tracking-widest mb-1">
              黑魔法誓約憑證 (密碼)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#141213] border border-zinc-800 focus:border-[#ea3c5d] focus:outline-none rounded-md py-2.5 pl-10 pr-4 text-sm text-zinc-200 font-mono"
                placeholder="請輸入密碼（大於6字元）"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded bg-gradient-to-r from-[#801b30] to-[#51121d] hover:from-[#ea3c5d] hover:to-[#a11c37] border border-[#a11c37] text-white tracking-[0.2em] font-serif text-sm font-bold transition-all duration-300 shadow-xl"
          >
            {loading ? '契共鳴中...' : (isSignUp ? '確認契結永夜誓言' : '魂魄契合．登入')}
          </button>
        </form>

        {/* Google signin button */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
          <span className="relative px-3 bg-[#0e0c0d] text-[9px] text-zinc-600 font-mono tracking-widest uppercase">
            OR GOOGLE VERIFICATION
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2 bg-black hover:bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors duration-300 text-xs font-serif tracking-widest rounded-md flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.14-5.136 4.14-3.41 0-6.177-2.767-6.177-6.177s2.767-6.177 6.177-6.177c1.47 0 2.82.52 3.886 1.385l3.05-3.05C18.91 2.455 15.776 1.31 12.24 1.31 6.335 1.31 1.5 6.145 1.5 12.05s4.835 10.74 10.74 10.74c6.23 0 10.422-4.38 10.422-10.59 0-.61-.06-1.2-.175-1.765l-10.247-.15z"/>
          </svg>
          <span>使用 Google 快速對接</span>
        </button>

        {/* Toggle signin / register */}
        <div className="mt-5 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-400 hover:text-[#ea3c5d] font-serif tracking-widest transition-colors underline underline-offset-4"
          >
            {isSignUp ? '回到登入介面 Seek In' : '尚未在大殿著陸？由此註冊新玩家'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-zinc-600 font-serif leading-relaxed">
            * 提示：加入結社即贈送 500 點積分，可在結帳時無條抵抵扣現金。<br />
            所有機密檔案均受永夜密碼保護。
          </p>
        </div>
      </div>
    </div>
  );
}
