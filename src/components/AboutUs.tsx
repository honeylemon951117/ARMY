/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, BookOpen, User, Flame, Quote, Sparkles } from 'lucide-react';
import { MOCK_BRAND_STORY, BRAND_LOGO_URL } from '../data';

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-zinc-300">
      
      {/* Brand logo big presentation */}
      <div className="text-center mb-16 space-y-4">
        <div className="w-24 h-24 rounded-full border-2 border-[#801b30] bg-black mx-auto overflow-hidden shadow-2xl relative"
             style={{ boxShadow: '0 0 25px rgba(128,27,48,0.5)' }}>
          <img 
            src={BRAND_LOGO_URL} 
            alt="深淵與黑曜 大徽章" 
            className="w-full h-full object-cover grayscale brightness-90 hover:brightness-100 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#eae6e8] tracking-[0.25em] font-bold">
          關於我們 • 品牌故事
        </h1>
        <span className="block text-xs text-zinc-500 font-mono tracking-[0.4em] uppercase select-none">
          THE HOUSE OF ABYSS & OBSIDIAN
        </span>
      </div>

      {/* Quote Block */}
      <div className="bg-[#0e0c0d] border border-zinc-900 rounded-sm p-8 text-center relative max-w-3xl mx-auto mb-16">
        <Quote className="w-12 h-12 text-[#801b30]/20 absolute top-4 left-4" />
        <p className="text-lg sm:text-2xl font-serif text-[#e0a899] italic tracking-wide font-bold">
          {MOCK_BRAND_STORY.quote}
        </p>
        <Quote className="w-12 h-12 text-[#801b30]/20 absolute bottom-4 right-4 rotate-180" />
      </div>

      {/* Two-Column Essay details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-serif text-sm leading-relaxed text-zinc-400 mb-16 text-justify">
        <div className="space-y-4">
          <h3 className="text-base text-white tracking-widest font-bold pb-2 border-b border-[#801b30] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#ea3c5d]" /> 終生叛逆與暗黑之魂 Intro
          </h3>
          <p>
            {MOCK_BRAND_STORY.intro}
          </p>
          <p>
            在我們的理念中，哥特（Goth）從不只是一個冰冷的字眼，更不是廉價的萬聖節裝扮。它是一種看待世界的方式：是在短暫生命中對極致浪漫的追求，是在陰暗中直視靈魂殘缺的勇氣，是在眾人朝拜主流、追逐白晝時，我們選擇在星夜低垂時默然起舞。
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base text-white tracking-widest font-bold pb-2 border-b border-[#801b30] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#ea3c5d]" /> 古法硫化與不完美結晶 Concept
          </h3>
          <p>
            {MOCK_BRAND_STORY.concept}
          </p>
          <p>
            {MOCK_BRAND_STORY.materialsStory}
          </p>
        </div>
      </div>

      {/* Lookbook Styling Combinations */}
      <div className="bg-[#0c0a0b] border border-zinc-900 p-8 rounded-sm">
        <h3 className="text-lg font-serif text-[#e0a899] tracking-widest font-bold text-center mb-6 uppercase flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ea3c5d]" />
          ── 結社暗夜搭配指引 • Lookbook Styling ──
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Look 1 */}
          <div className="space-y-3 bg-zinc-950 p-4 border border-zinc-900 rounded-sm">
            <span className="font-mono text-zinc-500 block tracking-wider uppercase">Style Ceremonial #01</span>
            <h4 className="text-sm font-serif text-white font-bold tracking-wider">修道院聖歌（Monastic Chant）</h4>
            <div className="border-t border-[#801b30] w-8 my-1"></div>
            <p className="text-zinc-500 leading-relaxed text-justify">
              <strong>核心單品：</strong>倒十字尖塔天鵝絨蕾絲頸鏈、骸骨王座荊棘戒。
            </p>
            <p className="text-zinc-500 leading-relaxed text-justify">
              適合搭配高領黑色蕾絲維多利亞襯衫，長下擺褶皺暗黑連身裙，打造禁慾與神聖兼備的教堂古典哥德風範。
            </p>
          </div>

          {/* Look 2 */}
          <div className="space-y-3 bg-zinc-950 p-4 border border-zinc-900 rounded-sm">
            <span className="font-mono text-zinc-500 block tracking-wider uppercase">Style Ceremonial #02</span>
            <h4 className="text-sm font-serif text-white font-bold tracking-wider">吸血鬼浪漫（Vampiric Romance）</h4>
            <div className="border-t border-[#801b30] w-8 my-1"></div>
            <p className="text-zinc-500 leading-relaxed text-justify">
              <strong>核心單品：</strong>血棘棺柩玫瑰燻黑銀墜、蛛網結晶緋紅之淚耳環。
            </p>
            <p className="text-zinc-500 leading-relaxed text-justify">
              搭配深開領天鵝絨緊身胸衣，黑紅撞色斗篷。在微弱的烛火與猩紅水晶的交相折射中，展露高貴慵懶的深夜領主氣場。
            </p>
          </div>

          {/* Look 3 */}
          <div className="space-y-3 bg-zinc-950 p-4 border border-zinc-900 rounded-sm">
            <span className="font-mono text-zinc-500 block tracking-wider uppercase">Style Ceremonial #03</span>
            <h4 className="text-sm font-serif text-white font-bold tracking-wider">硬派工業龐克（Industrial Cyber）</h4>
            <div className="border-t border-[#801b30] w-8 my-1"></div>
            <p className="text-zinc-500 leading-relaxed text-justify">
              <strong>核心單品：</strong>邪蝠黑曜六角戒、惡夜之吻尖刺牛皮頸圈。
            </p>
            <p className="text-zinc-500 leading-relaxed text-justify">
              與手撕做舊棉T、金屬鏈扣、黑色戰術工裝褲結合。在粗獷的植鞣皮革與冰冷的亮銀鉚釘碰撞中，塑造無畏而硬漢的暗黑龐克行者形象。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
