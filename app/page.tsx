
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bgVisible, setBgVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [firstTimeVisible, setFirstTimeVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setBgVisible(true), 100);
    setTimeout(() => setBtnVisible(true), 700);
    setTimeout(() => setFirstTimeVisible(true), 1200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/hero/yosa-image-w1600.jpg"
              alt="yosaPARK"
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">ホーム</Link>
            <Link href="/diagnosis" className="text-gray-700 hover:text-pink-600 transition-colors">体質診断</Link>
            <Link href="/blends" className="text-gray-700 hover:text-pink-600 transition-colors">ハーブ紹介</Link>
            <Link href="/reservation" className="text-gray-700 hover:text-pink-600 transition-colors">予約</Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">お問い合わせ</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-pink-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="px-4 py-2 space-y-2">
              <Link 
                href="/" 
                className="block py-3 text-gray-700 hover:text-pink-600 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                ホーム
              </Link>
              <Link 
                href="/diagnosis" 
                className="block py-3 text-gray-700 hover:text-pink-600 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                体質診断
              </Link>
              <Link 
                href="/blends" 
                className="block py-3 text-gray-700 hover:text-pink-600 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                ハーブ紹介
              </Link>
              <Link 
                href="/reservation" 
                className="block py-3 text-gray-700 hover:text-pink-600 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                予約
              </Link>
              <Link 
                href="/contact" 
                className="block py-3 text-gray-700 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                お問い合わせ
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center overflow-hidden">
        {/* 画像＋ピンクグラデーションラッパー */}
        <div className="relative w-full flex justify-center items-center" style={{height: '280px', maxHeight: '30vh'}}>
          {/* 背景画像 */}
          <Image
            src="/images/hero/yosa-image-w1600.jpg"
            alt="yosaPARK ロゴとハーブ"
            fill
            style={{objectFit: 'contain', objectPosition: 'center', opacity: 0.85}}
            className="pointer-events-none select-none"
            priority
          />
          {/* ピンクグラデーションを画像と同じ範囲に */}
          <div className="absolute inset-0 bg-gradient-to-b from-pink-100/80 via-white/60 to-pink-200/80 z-10 pointer-events-none" />
        </div>
        {/* 下部は白背景＋ボタン */}
        <div className="w-full bg-white flex flex-col items-center">
          <div className="relative z-20 flex flex-col items-center w-full max-w-2xl pt-12 pb-16">
            <Link href="/diagnosis" className="w-full max-w-xs">
              <button className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-full px-10 py-5 text-xl font-bold shadow-lg transition-all flex items-center gap-2 w-full justify-center text-center transform hover:scale-105">
                <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                体質診断をはじめる
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">よもぎ蒸しとは？</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              韓国で600年以上の歴史を持つ伝統的な自然療法。よもぎをはじめとする薬草を煎じた蒸気で下半身を温めることで、心と体を芯から癒します。
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://readdy.ai/api/search-image?query=traditional%20korean%20yomogi%20steaming%20herbs%20in%20wooden%20bowl%2C%20dried%20mugwort%20leaves%20and%20various%20medicinal%20herbs%2C%20natural%20lighting%2C%20rustic%20wooden%20table%2C%20traditional%20herbal%20medicine%20setup%2C%20warm%20earthy%20tones%2C%20detailed%20texture%20of%20herbs%2C%20wellness%20and%20natural%20healing%20concept&width=600&height=400&seq=about-herbs&orientation=landscape" 
                alt="よもぎ蒸し用のハーブ" 
                className="rounded-lg shadow-lg w-full h-48 md:h-64 object-cover object-top"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">自然の恵みで美と健康を</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                よもぎには抗菌・抗炎症作用があり、古くから「万能薬草」として親しまれてきました。蒸気によって体を温めることで血行促進し、デトックス効果が期待できます。
              </p>
              <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                <li className="flex items-center">
                  <i className="ri-leaf-line text-green-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                  100％天然ハーブ使用
                </li>
                <li className="flex items-center">
                  <i className="ri-heart-line text-pink-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                  女性特有のお悩みに寄り添う
                </li>
                <li className="flex items-center">
                  <i className="ri-refresh-line text-blue-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                  リラックス効果で心も軽やか
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-pink-50 via-amber-50 to-green-50 relative overflow-hidden">
        {/* 装飾的な背景要素 */}
        <svg className="absolute left-0 top-0 w-40 h-40 opacity-10 z-0" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="50" rx="50" ry="50" fill="#A7F3D0"/></svg>
        <svg className="absolute right-0 bottom-0 w-56 h-56 opacity-10 z-0" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="50" rx="50" ry="50" fill="#F9A8D4"/></svg>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-200 via-pink-200 to-pink-400 shadow-lg mb-6 animate-fadein">
              {/* ハーブのSVGアイコン */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 40s-10-6.2-10-14.4C14 18 19 14 24 19c5-5 10-1 10 6.6C34 33.8 24 40 24 40Z" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#fff"/>
                <circle cx="24" cy="24" r="6" fill="#A7F3D0" stroke="#10B981" strokeWidth="2"/>
              </svg>
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-green-400 bg-clip-text text-transparent mb-6 drop-shadow-sm tracking-tight animate-fadein-slow">
              期待できる効果
            </h2>
            <p className="text-lg md:text-xl text-gray-600 px-4 max-w-3xl mx-auto leading-relaxed animate-fadein-slow">
              よもぎ蒸しで得られる様々な効果をご紹介します
            </p>
          </div>
          {/* 効果カード */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadein-slower">
            {/* 1 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 shadow mb-4">
                {/* 血行促進アイコン */}
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 32s-8-5-8-11.2C10 13 14 10 18 14c4-4 8-1 8 6.8C26 27 18 32 18 32Z" stroke="#EC4899" strokeWidth="2" fill="#fff"/></svg>
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">血行促進・温活効果</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-center">
                蒸気の温熱効果により、体の芯から温まり血行が促進されます。冷え性の改善や代謝向上に効果的です。
              </p>
            </div>
            {/* 2 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 shadow mb-4">
                {/* リラックスアイコン */}
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#E9D5FF"/><path d="M12 20c2 2 8 2 12 0" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/><circle cx="14" cy="15" r="1.5" fill="#A78BFA"/><circle cx="22" cy="15" r="1.5" fill="#A78BFA"/></svg>
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">リラックス・ストレス解消</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-center">
                ハーブの香りと温熱効果により、心身の緊張が解きほぐされ、深いリラクゼーションを得られます。
              </p>
            </div>
            {/* 3 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-green-300 to-green-500 shadow mb-4">
                {/* デトックスアイコン */}
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="8" y="8" width="20" height="20" rx="10" fill="#6EE7B7"/><path d="M18 14v8m0 0l-3-3m3 3l3-3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">デトックス・むくみ改善</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-center">
                発汗作用により老廃物が排出され、むくみの改善や体内浄化に効果的です。
              </p>
            </div>
            {/* 4 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow mb-4">
                {/* 女性ケアアイコン */}
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#BFDBFE"/><path d="M18 12v8m0 0l-3-3m3 3l3-3" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">女性特有のケア</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-center">
                生理不順、PMS、更年期症状など女性特有のお悩みに寄り添い、ホルモンバランスを整えます。
              </p>
            </div>
            {/* 5 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow mb-4">
                {/* 美肌アイコン */}
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#FDE68A"/><path d="M18 24c4 0 8-4 8-8s-4-8-8-8-8 4-8 8 4 8 8 8Z" stroke="#F59E42" strokeWidth="2" fill="#fff"/></svg>
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">美肌・美容効果</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-center">
                血行促進により肌のターンオーバーが活性化され、くすみや乾燥の改善に効果的です。
              </p>
            </div>
            {/* 6 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 shadow mb-4">
                {/* 睡眠アイコン */}
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#C7D2FE"/><path d="M24 20c-2 2-8 2-12 0" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/><circle cx="14" cy="21" r="1.5" fill="#6366F1"/><circle cx="22" cy="21" r="1.5" fill="#6366F1"/></svg>
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">睡眠改善・疲労回復</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-center">
                リラックス効果により質の良い睡眠をサポートし、疲労回復を促進します。
              </p>
            </div>
          </div>
        </div>
        <style jsx>{`
          .animate-fadein { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
          .animate-fadein-slow { animation: fadein 1.8s cubic-bezier(.4,0,.2,1) both; }
          .animate-fadein-slower { animation: fadein 2.2s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fadein { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: none; } }
        `}</style>
      </section>

      {/* First Time Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-6 shadow-lg">
              <i className="ri-user-heart-line text-white text-2xl md:text-3xl"></i>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-pink-600 to-gray-600 bg-clip-text text-transparent">
              初めての方へ
            </h2>
            <p className="text-lg md:text-xl text-gray-600 px-4 max-w-3xl mx-auto leading-relaxed">
              安心してご利用いただけるよう、丁寧にサポートいたします
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6 md:space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">体質診断</h3>
                      <p className="text-gray-600 leading-relaxed">
                        簡単な質問にお答えいただき、あなたの体質を診断します。約3分で最適なブレンドをご提案いたします。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">ブレンド選択</h3>
                      <p className="text-gray-600 leading-relaxed">
                        診断結果に基づいて、最適なハーブブレンドをご提案します。あなたの体質に合わせた特別なブレンドです。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">ご予約</h3>
                      <p className="text-gray-600 leading-relaxed">
                        お好みの日時を選択して、簡単にご予約いただけます。オンライン予約で24時間受付中です。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">施術・アフターケア</h3>
                      <p className="text-gray-600 leading-relaxed">
                        経験豊富なスタッフが丁寧にサポートし、継続的にケアいたします。アフターケアも万全です。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* メイン画像 */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/images/hero/o0640042515012629794.jpg" 
                    alt="よもぎ蒸し施術を受けている女性" 
                    className="w-full h-64 md:h-96 object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  {/* オーバーレイグラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  {/* 左上の装飾要素 */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                      <i className="ri-heart-line text-white text-sm"></i>
                    </div>
                  </div>
                  {/* 右上の装飾要素 */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <i className="ri-leaf-line text-white text-sm"></i>
                    </div>
                  </div>
                </div>
                {/* 右下の安心・安全バッジ */}
                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/40 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <i className="ri-star-fill text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">安心・安全</p>
                      <p className="text-xs text-gray-600">完全個室・清潔管理</p>
                    </div>
                  </div>
                </div>
                {/* 左下の追加情報 */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-white/40 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <i className="ri-time-line text-white text-xs"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">約60分</p>
                      <p className="text-xs text-gray-600">施術時間</p>
                    </div>
                  </div>
                </div>
                {/* 装飾的な背景要素 */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-400 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-30 animate-pulse delay-500"></div>
                <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-green-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white via-pink-50 to-white text-pink-700 relative overflow-hidden">
        {/* 装飾的な背景要素 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-200 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-lg border border-pink-100">
            <i className="ri-heart-line text-pink-500 text-2xl md:text-3xl"></i>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 px-4 leading-tight text-pink-600">
            あなたの体質に合った<br/>
            <span className="text-pink-500">よもぎ蒸し</span>
            を見つけませんか？
          </h2>
          <p className="text-lg md:text-xl mb-8 md:mb-10 px-4 max-w-2xl mx-auto leading-relaxed text-pink-600">
            無料の体質診断で、あなたにぴったりのハーブブレンドをご提案します。<br/>
            自然の恵みで心と体を癒す、特別な体験をお届けします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/diagnosis" className="bg-white text-pink-600 hover:bg-pink-50 px-8 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-semibold transition-all transform hover:scale-105 shadow-lg inline-block whitespace-nowrap cursor-pointer min-h-[50px] flex items-center justify-center border border-pink-200">
              <i className="ri-arrow-right-line mr-2"></i>
              今すぐ体質診断をはじめる
            </Link>
            <Link href="/blends" className="bg-white/80 backdrop-blur-sm text-pink-600 border-2 border-pink-200 hover:bg-pink-50 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center">
              ブレンドを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-gray-400 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}>
                yosaPARK
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                自然の恵みで心と体を癒す、伝統的なよもぎ蒸しサロン
              </p>
            </div>
            
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">メニュー</h3>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><Link href="/" className="hover:text-white transition-colors cursor-pointer">ホーム</Link></li>
                <li><Link href="/diagnosis" className="hover:text-white transition-colors cursor-pointer">体質診断</Link></li>
                <li><Link href="/blends" className="hover:text-white transition-colors cursor-pointer">ハーブ紹介</Link></li>
                <li><Link href="/reservation" className="hover:text-white transition-colors cursor-pointer">予約</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">お問い合わせ</h3>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li className="flex items-center">
                  <i className="ri-phone-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  03-1234-5678
                </li>
                <li className="flex items-center">
                  <i className="ri-mail-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  info@yomogi.jp
                </li>
                <li className="flex items-center">
                  <i className="ri-map-pin-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  東京都渋谷区〇〇1-2-3
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">SNS</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2">
                  <i className="ri-line-fill text-xl w-6 h-6 flex items-center justify-center"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2">
                  <i className="ri-instagram-line text-xl w-6 h-6 flex items-center justify-center"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2">
                  <i className="ri-twitter-line text-xl w-6 h-6 flex items-center justify-center"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm md:text-base">
            <p>&copy; 2024 yosaPARK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
