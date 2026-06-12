/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Mail, Share2, Eye, Compass, ThumbsUp, MapPin, Tag, Check, Award, Search, Sparkles } from 'lucide-react';
import { MOCK_SOCIAL_POSTS, MOCK_EDM_CAMPAIGN, MOCK_SEO_DOCS } from '../data';

export default function MarketingView() {
  const [activeTab, setActiveTab] = useState<'copy' | 'social' | 'edm' | 'seo'>('copy');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const copyStatusIndicator = (label: string) => {
    return copiedText === label ? (
      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
        <Check className="w-2.5 h-2.5" /> 已複製到剪貼簿
      </span>
    ) : (
      <button
        onClick={() => handleCopy(textPresets[label] || '', label)}
        className="text-[10px] text-zinc-500 hover:text-[#ea3c5d] flex items-center gap-1 font-mono transition-colors"
      >
        <Copy className="w-3 h-3" /> 複製此段文案
      </button>
    );
  };

  // Preset text block mapping for easy copying
  const textPresets: { [key: string]: string } = {
    slogan: '「世人追逐太陽，我們在陰影中重塑星光。」',
    manifesto: '深淵與黑曜 (Abyss & Obsidian) 誕生於無邊狂躁與速食工業的夾縫。當世界將奢華與美麗等同於無暇、等同於明亮時，我們看見了凋落、殘缺與永恆黑夜中所蘊藏的，更為純粹、更不屈服的力量。我們在古大教堂的斑駁尖頂下汲取靈感，將亞文化、哥特龐克、吸血鬼文學以及中世紀煉金術融入每一塊沉甸甸的 925 銀器中。',
    post1: MOCK_SOCIAL_POSTS[0].content,
    post2: MOCK_SOCIAL_POSTS[1].content,
    post3: MOCK_SOCIAL_POSTS[2].content,
    edm_content: MOCK_EDM_CAMPAIGN.content,
    seo1_desc: MOCK_SEO_DOCS[0].description,
    seo2_desc: MOCK_SEO_DOCS[1].description,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-zinc-300">
      
      {/* Page Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#eae6e8] tracking-widest font-bold uppercase">
          ── 品牌推廣與行銷文案大典 ──
        </h2>
        <span className="block text-[10px] text-zinc-500 font-mono tracking-[0.3em] mt-1 select-none">
          COVEN BRAND COPYWRITING & MARKETING SYSTEM
        </span>
      </div>

      {/* Tabs Menu */}
      <div className="flex justify-center border-b border-zinc-900 mb-8 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('copy')}
          className={`px-4 sm:px-6 py-3 font-serif text-sm tracking-widest border-b-2 uppercase transition-all flex items-center gap-1.5 ${
            activeTab === 'copy'
              ? 'text-[#ea3c5d] border-[#ea3c5d] font-bold'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>網站核心文案</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 sm:px-6 py-3 font-serif text-sm tracking-widest border-b-2 uppercase transition-all flex items-center gap-1.5 ${
            activeTab === 'social'
              ? 'text-[#ea3c5d] border-[#ea3c5d] font-bold'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>社群推廣貼文</span>
        </button>
        <button
          onClick={() => setActiveTab('edm')}
          className={`px-4 sm:px-6 py-3 font-serif text-sm tracking-widest border-b-2 uppercase transition-all flex items-center gap-1.5 ${
            activeTab === 'edm'
              ? 'text-[#ea3c5d] border-[#ea3c5d] font-bold'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>EDM 電子報發送</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 sm:px-6 py-3 font-serif text-sm tracking-widest border-b-2 uppercase transition-all flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'text-[#ea3c5d] border-[#ea3c5d] font-bold'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO 搜尋優化文案</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-[#0b090a] border border-zinc-900 rounded-sm p-6 sm:p-10">
        
        {/* TAB 1: WEBSITE COPY */}
        {activeTab === 'copy' && (
          <div className="space-y-8 animate-fade-in">
            {/* Mission / Slogan */}
            <div className="border-l-4 border-[#801b30] pl-4 sm:pl-6 space-y-2">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                BRAND SLOGAN // 品牌靈魂標籤
              </span>
              <p className="text-xl sm:text-2xl font-serif text-[#eae6e8] italic font-bold">
                「世人追逐太陽，我們在陰影中重塑星光。」
              </p>
              <div className="flex justify-end pr-4">{copyStatusIndicator('slogan')}</div>
            </div>

            {/* Core Manifesto */}
            <div className="bg-zinc-950 p-6 rounded-md border border-zinc-900 space-y-4">
              <span className="text-xs text-[#e0a899] font-serif tracking-widest uppercase block">
                ✦ 永夜誓言 - 品牌宣言 Core Manifesto ✦
              </span>
              <p className="text-sm text-zinc-400 font-serif leading-relaxed text-justify">
                {textPresets.manifesto}
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-zinc-900 text-xs">
                <span className="text-zinc-600 font-mono">適用位置：關於我們頁面 / Lookbook 扉頁</span>
                {copyStatusIndicator('manifesto')}
              </div>
            </div>

            {/* UI Selling Points list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs font-serif">
              <div className="bg-[#121011] p-4 rounded border border-zinc-900 space-y-2">
                <span className="text-[#ea3c5d] font-bold uppercase tracking-wider block">1. 燻黑古銀美學工法 ──</span>
                <p className="text-zinc-500 leading-relaxed">
                  捨棄浮華的機器拋光，堅持手作強硫化深度燻黑。賦予銀飾大教堂石刻般的斑駁質地與神聖陰暗角。
                </p>
              </div>
              <div className="bg-[#121011] p-4 rounded border border-zinc-900 space-y-2">
                <span className="text-[#ea3c5d] font-bold uppercase tracking-wider block">2. 對抗能量黑曜石結界 ──</span>
                <p className="text-zinc-500 leading-relaxed">
                  天然礦石在熔岩深處歷經火焰擠壓。我們將其雕成不規則原石或銳利幾何角，為孤傲的靈魂架設偏執防御屏障。
                </p>
              </div>
              <div className="bg-[#121011] p-4 rounded border border-zinc-900 space-y-2">
                <span className="text-[#ea3c5d] font-bold uppercase tracking-wider block">3. 大馬士革天鵝絨禁錮 ──</span>
                <p className="text-zinc-500 leading-relaxed">
                  純手工細密編織，蕾絲花窗、重磅厚重天鵝絨貼身，宛如宣讀不向世俗低頭的夜間高貴誓言。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOCIAL MEDIA POSTS */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {MOCK_SOCIAL_POSTS.map((post) => {
              const label = post.id === 'post-1' ? 'post1' : post.id === 'post-2' ? 'post2' : 'post3';
              return (
                <div 
                  key={post.id}
                  className="bg-zinc-950 rounded-lg border border-zinc-900 overflow-hidden flex flex-col justify-between"
                  style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.6)' }}
                >
                  {/* Mock Post Header */}
                  <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#801b30] border border-red-500 flex items-center justify-center font-mono text-[10px] text-white">
                        A&O
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-white block">abyss_and_obsidian</span>
                        <span className="text-[9px] text-zinc-500 font-mono tracking-wider">首飾美學結社</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase">
                      {post.platform} PREVIEW
                    </span>
                  </div>

                  {/* Mock Image Box */}
                  <div className="aspect-square bg-zinc-900 relative">
                    <img 
                      src={post.imageUrl} 
                      alt="社群圖" 
                      className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur text-[9px] font-mono py-1 px-2 text-[#e0a899] rounded">
                      ❤️ {post.likes} 契合暗湧
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-zinc-300 font-serif leading-relaxed whitespace-pre-line text-justify">
                        {post.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between">
                      <p className="text-[10px] text-zinc-500 font-mono">
                        發佈時間: {post.date}
                      </p>
                      {copiedText === label ? (
                        <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/20 px-2 py-0.5 rounded">
                          ✓ 已複製貼文
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCopy(post.content, label)}
                          className="text-[10px] text-[#ea3c5d] hover:underline flex items-center gap-0.5 font-semibold"
                        >
                          <Copy className="w-3 h-3" /> 複製貼文
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: EDM CAMPAIGN */}
        {activeTab === 'edm' && (
          <div className="animate-fade-in max-w-3xl mx-auto border border-zinc-800 rounded shadow-2xl overflow-hidden bg-black">
            
            {/* Header info */}
            <div className="bg-[#1C1819] p-4 text-xs font-mono text-zinc-400 border-b border-zinc-900 space-y-1">
              <p><strong className="text-zinc-500">主旨 (Subject):</strong> {MOCK_EDM_CAMPAIGN.subject}</p>
              <p><strong className="text-zinc-500">寄件者 (From):</strong> 深淵與黑曜結社 &lt;noreply@abyss-obsidian.com&gt;</p>
              <p><strong className="text-zinc-500">收件者 (To):</strong> 親愛的夜行流浪者 &lt;goth_gloria@soul.com&gt;</p>
            </div>

            {/* Email Inner View */}
            <div className="p-6 sm:p-12 text-zinc-300 space-y-8 bg-zinc-950/40 relative">
              
              {/* Filigree corner details (Visual placeholder for premium layout) */}
              <div className="absolute top-4 left-4 text-[#801b30] font-mono text-base">◤</div>
              <div className="absolute top-4 right-4 text-[#801b30] font-mono text-base">◥</div>
              <div className="absolute bottom-4 left-4 text-[#801b30] font-mono text-base">◣</div>
              <div className="absolute bottom-4 right-4 text-[#801b30] font-mono text-base">◢</div>

              {/* Logo block */}
              <div className="text-center space-y-1 pt-4">
                <span className="text-[10px] tracking-[0.3em] font-mono text-[#e0a899] uppercase bg-[#241115] px-3 py-1 border border-[#801b30] rounded-full">
                  {MOCK_EDM_CAMPAIGN.badge}
                </span>
                <h1 className="text-2xl font-serif font-bold text-[#eae6e8] tracking-[0.2em] mt-4">深淵與黑曜</h1>
                <span className="block text-[8px] tracking-[0.35em] text-zinc-500 font-mono uppercase">
                  ABYSS & OBSIDIAN
                </span>
              </div>

              {/* Banner Placeholder */}
              <div className="h-40 bg-[#161415] rounded border border-zinc-900 flex items-center justify-center p-4">
                <p className="text-xs text-center font-serif text-zinc-500 italic max-w-sm">
                  【電子海報圖欄：由暗夜古銀黑曜石飾品構成之巴洛克儀式祭壇海報】
                </p>
              </div>

              {/* EDM Letter Body */}
              <div className="space-y-4 max-w-xl mx-auto text-justify">
                <h2 className="text-lg font-serif text-white tracking-widest text-center">
                  {MOCK_EDM_CAMPAIGN.title}
                </h2>
                <div className="border-t border-[#801b30]/40 w-16 mx-auto my-3"></div>
                <p className="text-sm text-zinc-400 font-serif leading-relaxed whitespace-pre-line">
                  {textPresets.edm_content}
                </p>
              </div>

              {/* Call to action button */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  className="px-8 py-3 rounded-md bg-[#801b30] hover:bg-[#ea3c5d] border border-[#a11c37] text-white tracking-[0.15em] font-serif font-bold text-xs uppercase shadow-xl transition-all"
                >
                  {MOCK_EDM_CAMPAIGN.callToAction}
                </button>
              </div>

              {/* Footer */}
              <div className="text-center text-[10px] text-zinc-500 font-serif pt-8 border-t border-zinc-900/60 max-w-lg mx-auto space-y-1">
                <p>© 2026 Abyss & Obsidian Co., Ltd. 永夜結社版權所有</p>
                <p>若您不願再次收到深淵召喚，可點擊此處 <span className="underline cursor-pointer">解除結解誓約（取消訂閱）</span>。</p>
              </div>
            </div>

            {/* Save/Copy code */}
            <div className="bg-[#1C1819] p-4 border-t border-zinc-900 flex items-center justify-between">
              <span className="text-[11px] font-serif text-zinc-500">
                此範本適用於會員註冊歡迎信及大慶行銷郵件。
              </span>
              {copiedText === 'edm' ? (
                <span className="text-xs text-emerald-400 font-mono">已完成複製 EDM 內文！</span>
              ) : (
                <button
                  onClick={() => handleCopy(textPresets.edm_content, 'edm')}
                  className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-[#801b30] border border-zinc-800 text-zinc-300 text-xs tracking-wider transition-colors font-serif"
                >
                  複製 EDM 電子郵件內文
                </button>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: SEO OPTIMIZATION DOCUMENT */}
        {activeTab === 'seo' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#121011] p-4 rounded border border-zinc-900 leading-relaxed text-xs">
              <div className="flex items-center gap-2 text-yellow-500 font-bold mb-2">
                <Search className="w-5 h-5" />
                <span className="text-sm font-serif">哥特飾品網頁之 SEO 檢索架構書 (傳統中文 Google 最佳化)</span>
              </div>
              <p className="text-zinc-500 font-serif">
                為確保本亞文化飾品站在搜尋引擎中能被那些追尋「哥德項鍊」、「燻黑銀飾」及「暗黑龐克穿搭」的同好精準鎖定，我們特意佈局以下高價值關鍵字、詮釋標籤（Meta Tags）及 H 標籤語法階層。
              </p>
            </div>

            {MOCK_SEO_DOCS.map((doc, idx) => (
              <div 
                key={idx}
                className="bg-black/40 border border-zinc-900 p-6 rounded-md space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <span className="font-serif text-[#ea3c5d] font-bold text-sm tracking-widest flex items-center gap-1">
                    <Award className="w-4 h-4" /> SEO 頁面配置：{doc.page}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">TEMPLATE {idx+1}</span>
                </div>

                <div className="space-y-3 font-serif">
                  {/* Title Tag */}
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-1">
                      &lt;title&gt; 網頁標題標籤 (建議 50-60 字以內)
                    </span>
                    <p className="text-xs text-white bg-zinc-950 p-2.5 rounded border border-zinc-900 font-semibold font-serif">
                      {doc.title}
                    </p>
                  </div>

                  {/* Focus Keywords */}
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-1">
                      Focus Keywords 核心關鍵字群 (與亞文化穿搭深度鎖定)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.keywords.map((kw, kIdx) => (
                        <span key={kIdx} className="bg-[#241115] border border-[#a11c37]/30 text-[#e0a899] text-[10px] px-2 py-0.5 rounded font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-1">
                      &lt;meta name=&quot;description&quot;&gt; 詮釋摘要限制 (120-150 字)
                    </span>
                    <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900 text-xs text-zinc-400 space-y-2">
                      <p>{doc.description}</p>
                      <div className="flex justify-end">
                        {copiedText === `seo${idx}` ? (
                          <span className="text-[10px] text-emerald-400">已複製 Meta Description</span>
                        ) : (
                          <button
                            onClick={() => handleCopy(doc.description, `seo${idx}`)}
                            className="text-[10px] text-zinc-500 hover:text-[#ea3c5d] flex items-center gap-0.5"
                          >
                            <Copy className="w-3 h-3" /> 複製摘要
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* HTML Heading Hierarchy Check */}
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-1">
                      Crawler Heading Hierarchy 搜尋引擎階層 H 標籤配置
                    </span>
                    <div className="bg-zinc-950 p-3 rounded border border-zinc-900 space-y-1.5 font-mono text-[11px] text-zinc-500">
                      {doc.structure.map((h, hIdx) => (
                        <p key={hIdx} className="hover:text-zinc-300">
                          {h.startsWith('H1') ? <strong className="text-[#ea3c5d] font-bold font-serif">{h}</strong> : h}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
