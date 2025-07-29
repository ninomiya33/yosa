'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HerbsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">ホーム</Link>
            <Link href="/diagnosis" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">体質診断</Link>
            <Link href="/blends" className="text-pink-600 font-semibold cursor-pointer">ハーブ紹介</Link>
            <Link href="/menu" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">メニュー</Link>
            <Link href="/reservation" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">予約</Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">お問い合わせ</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-700 focus:outline-none"
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
                className="block py-3 text-gray-700 hover:text-green-700 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                ホーム
              </Link>
              <Link 
                href="/diagnosis" 
                className="block py-3 text-gray-700 hover:text-green-700 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                体質診断
              </Link>
              <Link 
                href="/blends" 
                className="block py-3 text-green-700 font-semibold border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                ハーブ紹介
              </Link>
              <Link 
                href="/menu" 
                className="block py-3 text-gray-700 hover:text-green-700 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                メニュー
              </Link>
              <Link 
                href="/reservation" 
                className="block py-3 text-gray-700 hover:text-green-700 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                予約
              </Link>
              <Link 
                href="/contact" 
                className="block py-3 text-gray-700 hover:text-green-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                お問い合わせ
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 text-center bg-cover bg-center" style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=variety%20of%20colorful%20dried%20herbs%20and%20botanical%20ingredients%20arranged%20beautifully%2C%20natural%20herbal%20medicine%20collection%2C%20traditional%20korean%20wellness%20herbs%2C%20mugwort%20lavender%20ginger%20rose%20petals%2C%20artistic%20herb%20display%2C%20natural%20spa%20ingredients%2C%20warm%20lighting%2C%20therapeutic%20plant%20medicine%20showcase&width=1200&height=400&seq=herbs-hero&orientation=landscape')`
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            ハーブ紹介
          </h1>
          <p className="text-lg md:text-xl text-white opacity-90 px-4">
            ファインハーブ10種類、バーニングハーブ11種類を配合した美しさを最大限に引き出すオリジナルハーブ
          </p>
        </div>
      </section>

      {/* Herbs Description */}
      <section className="py-8 md:py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            11種のハーブ紹介
          </h2>
          <div className="bg-gradient-to-r from-pink-50 to-amber-50 p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="mb-6">
              <Image 
                src="/images/herbs/スクリーンショット 2025-07-28 1.36.12.png" 
                alt="ハーブ一覧" 
                width={600} 
                height={400} 
                className="w-full max-w-2xl mx-auto rounded-xl shadow-md"
              />
            </div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              ファインハーブは10種類、バーニングハーブが11種類のハーブを配合。美しさを最大限に引き出すオリジナルハーブ。
            </p>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">【効能・効果】</h3>
              <p className="text-base md:text-lg text-gray-700">
                荒れ性、肩のこり、神経痛、しっしん、痔、冷え症、腰痛、リウマチ、疲労回復、産前産後の冷え症
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 px-4">
            オリジナルハーブブレンドを体験しませんか？
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-4">
            11種類のハーブを配合した美しさを最大限に引き出すオリジナルハーブブレンドで、心と体を癒しましょう
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/diagnosis" className="bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center">
              体質診断を受ける
            </Link>
            <Link href="/menu" className="bg-white hover:bg-gray-50 text-green-600 border-2 border-green-500 px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold transition-all inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center">
              メニューを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="text-xl md:text-2xl font-bold mb-4" style={{ fontFamily: 'Pacifico, serif' }}>
                よもぎ蒸し
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
            <p>&copy; 2024 よもぎ蒸しサロン. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}