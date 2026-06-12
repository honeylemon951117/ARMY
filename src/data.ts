/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Coupon, SocialPost, EdmCampaign, SeoDoc } from './types';

export const BRAND_LOGO_URL = "/src/assets/images/gothic_brand_logo_1781232361916.jpg";
export const BRAND_BANNER_URL = "/src/assets/images/gothic_banner_hero_1781232373144.jpg";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: '血棘棺柩 玫瑰燻黑銀墜',
    category: 'necklace',
    price: 3480,
    material: '925 燻黑純銀、天然深邃黑瑪瑙、手作微雕血櫻玫瑰',
    description: '以18世紀維多利亞時代的吸血鬼棺木為設計靈感，手作交織纏繞的荊棘中開出一朵永存的血色玫瑰。古法氧化重現霧夜英倫大霧中的歲月感。',
    image: '/src/assets/images/gothic_product_pendant_1781232388407.jpg',
    isFeatured: true,
    stock: 7,
    story: '在荊棘與永夜的交界，盛放的玫瑰與永眠的靈柩低語著不朽的愛。這是獻給追尋極致浪漫與暗黑美學之人的首選神聖信物。'
  },
  {
    id: 'prod-02',
    name: '邪蝠黑曜 六角雕花古戒',
    category: 'ring',
    price: 2980,
    material: '925 燻黑純銀、天然六角形切面黑曜石、側邊巴洛克宮廷浮雕',
    description: '巨大的六角極黑曜石被微張的惡魔蝠翼金屬爪緊緊咬住。光芒與暗淡折射的交會，流洩出寂靜的微光。指側雕刻了細密繁盛的尖頂玫瑰。',
    image: '/src/assets/images/gothic_product_ring_1781232399433.jpg',
    isFeatured: true,
    stock: 12,
    story: '極黑黑曜石是抵禦外界負能量的防禦之盾，而惡魔蝠翼則在黑夜中默默守護主人的桀驁靈魂，不被喧囂的紅塵打擾。'
  },
  {
    id: 'prod-03',
    name: '蛛網結晶 緋紅之淚吊墜耳環',
    category: 'earrings',
    price: 2280,
    material: '925 低敏純銀針、奧地利多面琢面緋紅水晶、手作微型蜘蛛',
    description: '細膩精緻如鋼絲的蛛網中，墜下一滴令人眩暈的猩紅靈魂。彷彿冷冬晨曦中捕獲的寒光，在寂靜中閃爍著巴洛克悲劇的浪漫色彩。',
    image: '/src/assets/images/gothic_product_earrings_1781232410364.jpg',
    isFeatured: true,
    stock: 9,
    story: '網是宿命纏繞的羈絆，淚是致命優雅角色的縮影。在蛛網交錯的深處，靜候著那位願意無悔墜入黑夜獵捕陷阱的高雅靈魂。'
  },
  {
    id: 'prod-04',
    name: '天鵝絨 倒十字尖塔蕾絲頸鏈',
    category: 'choker',
    price: 1880,
    material: '頂級英倫刺繡蕾絲、重磅黑色天鵝絨、古銀鑄造尖塔、多面石榴石吊珠',
    description: '以柔軟重金天鵝絨為底，環繞大馬士革復古蕾絲。垂墜精雕的倒十字與哥特大教堂空心花窗，紅石榴石小水滴隨步伐擺動摇曳。',
    image: '/src/assets/images/gothic_product_choker_1781232425469.jpg',
    isFeatured: true,
    stock: 15,
    story: '環繞在頸項的，是不向世俗低頭的永夜誓言。反叛的倒十字大教堂尖塔窗格吊墜，低唱著屬於亞文化自由高貴的夜行戰歌。'
  },
  {
    id: 'prod-05',
    name: '骸骨王座 荊棘冠冕純銀戒',
    category: 'ring',
    price: 2480,
    material: '925 燻黑純銀、微鑽黑鋯石、古董氧化技術',
    description: '設計取材自荊棘之冠，每一根倒刺均經過圓潤拋光處理，在保證配戴舒適的同時，重現中世紀荊棘王冠疊起之神聖，黑鋯石在荊棘間低調閃耀。',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    isFeatured: false,
    stock: 5,
    story: '欲戴王冠，必承其重。將苦痛折磨化為指尖的無上權力，這是深淵中最耀眼的骨感冠冕。'
  },
  {
    id: 'prod-06',
    name: '暗夜之眼 巴洛克異形珍珠項鍊',
    category: 'necklace',
    price: 3880,
    material: '巴洛克不規則異形珍珠、925 純銀十字架鏈、純銀鑄造魔瞳飾片',
    description: '精選獨一無二的異形巴洛克珍珠，上方精嵌神智的「暗夜之眼」古銀飾片。珍珠的柔和彩光與金屬的剛毅，構成衝突又和谐的和諧暗黑張力。',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    isFeatured: false,
    stock: 4,
    story: '每一顆不規則珍珠都代表一個流離失所的心，而在夜中觀照眾生的魔瞳將帶領你，在無主的光影之海中找到同歸的彼岸。'
  },
  {
    id: 'prod-07',
    name: '黑羽墮天 淚滴流蘇長耳墜',
    category: 'earrings',
    price: 1980,
    material: '925 燻黑銀鉤、頂級手工消光黑色公雞羽毛、高透黑水晶',
    description: '純銀精雕墮天使折翼結構，緊接著傾瀉而下的天然黑色公雞亮澤長羽。隨著佩戴者的步伐，展現輕柔飄逸、帶著憂鬱氣質的長流蘇動態。',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    isFeatured: false,
    stock: 10,
    story: '折斷羽翼的天使選擇留守凡間的陰影中，那一抹寂靜優雅的黑羽，是從天空隕落後洗淨鉛華的最終傲骨。'
  },
  {
    id: 'prod-08',
    name: '惡夜之吻 尖刺鉚釘全皮革頸圈',
    category: 'choker',
    price: 2180,
    material: '頭層植鞣黑色小牛皮、金屬古銀實心鉚釘、不鏽鋼刻文雙D環',
    description: '極高質感的進口黑牛皮精心剪裁，邊緣經手工封邊打磨。金屬雕花雙帶結構，前置復古鉚釘，是龐克（Punk）與硬派哥特（Industrial Goth）的終極結合。',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    isFeatured: false,
    stock: 8,
    story: '皮革是馴服的溫度，鉚釘是反叛的尖角。這是寫給無畏者的夜間束縛詩篇，張揚自我與非傳統美學。'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'GOTHIC10',
    discountType: 'percentage',
    value: 10,
    minSpend: 1000,
    description: '【暗黑初降】首購全店消費滿 TWD $1,000 即享 9 折。'
  },
  {
    code: 'SHADOW20',
    discountType: 'percentage',
    value: 20,
    minSpend: 2500,
    description: '【暗影低語】全店大典消費滿 TWD $2,500 即享 8 折。'
  },
  {
    code: 'ABYSS300',
    discountType: 'fixed',
    value: 300,
    minSpend: 3000,
    description: '【深淵禮讚】尊爵消費滿 TWD $3,000 直接抵扣 TWD $300 現金。'
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    imageUrl: '/src/assets/images/gothic_product_pendant_1781232388407.jpg',
    content: '「我們在黑夜的靈柩中，刻下玫瑰的印記。」\n新系列【血棘棺柩】大祭司墜飾正式暗湧登場。\n精密的925燻黑工法，述說著不死的情愫。與黑夜共舞的行者，你們的靈魂項鏈正靜待命運呼喚。\n\n#哥特首飾 #亞文化 #暗黑美學 #黑銀純銀 #古銀 #飾品設計 #不朽之愛 #AbyssObsidian',
    hashtags: ['哥特首飾', '亞文化', '暗黑美學', '燻黑純銀', '維多利亞哥特'],
    likes: 666,
    date: '2026-06-10'
  },
  {
    id: 'post-2',
    platform: 'threads',
    imageUrl: '/src/assets/images/gothic_product_choker_1781232425469.jpg',
    content: '有沒有人跟我們一樣，只要一出門脖頸上空無一物，就會感到極度缺乏安全感？😅\n【倒十字尖塔天鵝絨蕾絲頸鏈】完美貼合你的肌膚。不僅是修飾頸部線條的秘密武器，更是你今天向庸俗世界宣誓不服從的叛逆十字。今晚20:00限量上線，加入結社。',
    hashtags: ['choker', '穿搭日常', '亞文化穿搭', '天鵝絨頸鏈', '反叛之心'],
    likes: 412,
    date: '2026-06-08'
  },
  {
    id: 'post-3',
    platform: 'facebook',
    imageUrl: '/src/assets/images/gothic_product_ring_1781232399433.jpg',
    content: '【修道院的呢喃 —— 邪蝠黑曜古銀戒】\n黑曜石向來是冥想與結界防御的神聖之石。我們將其中注入了中世紀大教堂的雕花構思。黑曜石銳利的六角切割與霧面氧化的純銀蝠翼，在指間流露出無聲的強大氣場。你是想要抵禦浮躁，抑或是展示傲氣？全款式限量50件，售罄不補。',
    hashtags: ['黑曜石戒指', '巴洛克古銀', '哥特飾品', '獨立設計', '抗負能量'],
    likes: 831,
    date: '2026-06-05'
  }
];

export const MOCK_EDM_CAMPAIGN: EdmCampaign = {
  id: 'edm-welcome',
  subject: '【永夜結社 閣下啟】來自深淵邀請函：您有一筆 500 積分待解鎖（內含神秘首購禮包）',
  title: '親愛的暗夜行者：歡迎涉入深淵的懷抱',
  badge: 'Coven of Abyss & Obsidian • 秘密結社信箋',
  content: `願黑夜如輕紗般溫柔拂在您的面龐。

我們是【深淵與黑曜】。在一座充斥著霓虹、速食與工業量產的喧囂城市中，我們執意尋找與我們擁有相同靈魂頻率的夜行者。我們不隨波逐流，我們選擇在殘缺的美、凋零的玫瑰與神聖的黑夜中，構築我們孤傲精緻的哥特飾品殿堂。

為慶祝您正式登錄暗夜結社，我們已將【500點 會員首選積分】注入您的結社印記。
每一點积分，都可直接在您的結社行囊（購物車）中抵折 TWD $1 元現金。

此外，我們隨信附上首購神秘咒語。
在結帳時唸「 GOTHIC10 」，全店首購不限品項即享 9 折。

與世俗決裂，今晚，邀您與我們共度永夜。`,
  callToAction: '立刻啟航．探索禁忌飾品系列'
};

export const MOCK_SEO_DOCS: SeoDoc[] = [
  {
    page: '【首頁 / 全站】',
    title: '哥特飾品品牌推薦｜深淵與黑曜 Abyss & Obsidian｜台灣獨家亞文化暗黑美學銀飾',
    keywords: ['哥特飾品', '暗黑美學飾品', '亞文化銀飾', '925燻黑純銀', '台灣哥德頸鍊', '重工業龐克戒指', '巴洛克黑色首飾'],
    description: '深淵與黑曜為台灣極致暗黑哥特美學飾品品牌。匠人精神精琢925燻黑純銀、天然黑曜石、巴洛克宮廷蕾絲、吸血鬼棺木飾物與反抗倒十字頸鍊。點燃內在亞文化魂魄，與黑夜共同呼吸。提供全球配送，凡註冊享500點積分抵扣。',
    structure: [
      'H1: 哥特飾品起源與暗黑魂魄｜深淵與黑曜官網',
      'H2: 精選暗黑哥特首飾 —— 燻黑銀墜、吸血鬼戒、蛛網耳環、天鵝絨頸鍊',
      'H3: 匠人古氧化工法 925 飾品保養細則',
      'H4: 顧客評價、暗夜美學、亞文化穿搭 lookbook 指南'
    ]
  },
  {
    page: '【商品詳情 / 血棘棺柩】',
    title: '維多利亞吸血鬼棺柩玫瑰純銀項鍊 ｜ 哥德風情銀飾推薦',
    keywords: ['吸血鬼棺材項鍊', '玫瑰純銀項鍊', '燻黑棺材墜飾', '復古哥德項飾', '男女無性別哥德飾品'],
    description: '完美手工重現18世紀大霧英倫風格。微雕不凋玫瑰盤繞古銀棺柩墜飾，內嵌高品質黑瑪瑙。高對比度的燻黑細密紋理，保證在人群中脫穎而出。首購現折 TWD $500。',
    structure: [
      'H1: 血棘棺柩 玫瑰燻黑古銀墜 - 頂級巴洛克暗黑工藝',
      'H2: 材質核心：925純銀、防禦負能量黑瑪瑙、手造浮雕藝術',
      'H3: 吸血鬼棺材項鍊穿搭與哥德式服裝搭配美學'
    ]
  }
];

export const MOCK_BRAND_STORY = {
  quote: "「世人追逐太陽，我們在陰影中重塑星光。」",
  intro: "深淵與黑曜 (Abyss & Obsidian) 誕生於無邊狂躁與速食工業的夾縫。當世界將奢華與美麗等同於無暇、等同於明亮時，我們看見了凋落、殘缺與永恆黑夜中所蘊藏的，更為純粹、更不屈服的力量。我們在古大教堂的斑駁尖頂下汲取靈感，將亞文化（Subculture）、哥特龐克（Gothic Punk）、吸血鬼文學以及中世紀煉金術融入每一塊沉甸甸的 925 銀器中。",
  concept: "我們的每一款飾品，均採用古法高溫『氧化燻黑』工藝。這並非損壞，而是歷史的刻痕，象徵拒絕光鮮偽裝、直面最本真的靈魂。那些交錯的蜘蛛網、盤旋的蝙蝠羽翼、肅穆的倒十字與緊閉的棺木，不僅僅是配飾，更是在這群離經叛道、追求精神極致的夜行者身上，發出沉悶而不可忽視的集結暗號。",
  materialsStory: "我們嚴選 925 純銀，經多重燻黑打磨，保留斑駁陰暗面。並與天然半寶石（守護之石黑曜石、避邪黑瑪瑙、神秘深灰石榴石）相互結晶。就連最脆弱的頸鏈，亦採用重磅天鵝絨與大馬士革蕾絲，帶來緊貼肌膚、宛如禁錮般優雅而令人沉醉的感官體驗。"
};
