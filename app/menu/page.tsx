'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  getAllMenuItems, 
  getMenuRecommendations, 
  getPopularMenuItems, 
  getNewMenuItems, 
  getLimitedMenuItems,
  type MenuItem 
} from '../lib/menuRecommendations';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const result = searchParams.get('result');
  const selectedMenu = searchParams.get('menu');
  
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const allMenuItems = getAllMenuItems();
  const popularMenuItems = getPopularMenuItems();
  const newMenuItems = getNewMenuItems();
  const limitedMenuItems = getLimitedMenuItems();
  const menuRecommendation = result ? getMenuRecommendations(result) : null;

  // 選択されたメニューがある場合は詳細を表示
  useEffect(() => {
    if (selectedMenu) {
      const menuItem = allMenuItems.find(item => item.id === selectedMenu);
      if (menuItem) {
        setSelectedMenuItem(menuItem);
      }
    }
  }, [selectedMenu, allMenuItems]);

  const getFilteredMenuItems = () => {
    switch (activeTab) {
      case 'popular':
        return popularMenuItems;
      case 'new':
        return newMenuItems;
      case 'limited':
        return limitedMenuItems;
      case 'recommended':
        return result && menuRecommendation 
          ? [...menuRecommendation.primaryRecommendations, ...menuRecommendation.secondaryRecommendations]
          : [];
      default:
        return allMenuItems;
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'ボディトリ': 'bg-purple-100 text-purple-700',
      'ボディケア': 'bg-blue-100 text-blue-700',
      'ボディ': 'bg-green-100 text-green-700',
      'フェイシャル': 'bg-pink-100 text-pink-700',
      'その他': 'bg-gray-100 text-gray-700'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-700';
  };

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
            <Link href="/blends" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">ハーブ紹介</Link>
            <Link href="/menu" className="text-pink-600 font-semibold cursor-pointer">メニュー</Link>
            <Link href="/reservation" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">予約</Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">お問い合わせ</Link>
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
                href="/menu" 
                className="block py-3 text-pink-600 font-semibold border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                メニュー
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
      <section className="relative py-12 md:py-16 px-4 text-center bg-cover bg-center" style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=spa%20menu%20with%20various%20wellness%20treatments%20and%20massage%20services%2C%20beautiful%20salon%20interior%2C%20relaxing%20atmosphere%2C%20professional%20spa%20services%2C%20wellness%20menu%20display%2C%20luxury%20spa%20treatments%2C%20natural%20healing%20services%2C%20mugwort%20steaming%20treatments%2C%20warm%20lighting%2C%20elegant%20spa%20environment&width=1200&height=400&seq=menu-hero&orientation=landscape')`
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            メニュー一覧
          </h1>
          <p className="text-lg md:text-xl text-white opacity-90 px-4">
            あなたの体質とお悩みに合わせた、最適なメニューをお選びください
          </p>
        </div>
      </section>

      {/* 診断結果からの推薦セクション */}
      {result && menuRecommendation && (
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 md:p-8 shadow-lg mb-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-heart-line text-white text-xl md:text-2xl"></i>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">診断結果からのおすすめ</h2>
                <p className="text-gray-600">{menuRecommendation.explanation}</p>
              </div>

              {/* 期待できる効果 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">期待できる効果</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {menuRecommendation.benefits.map((benefit, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="ri-check-line text-pink-600 text-sm"></i>
                      </div>
                      <p className="text-xs md:text-sm text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* おすすめメニュー */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">特におすすめのメニュー</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuRecommendation.primaryRecommendations.map((menuItem) => (
                    <div key={menuItem.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-1 line-clamp-2">
                            {menuItem.title}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-pink-600">¥{menuItem.price.toLocaleString()}</span>
                            {menuItem.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">¥{menuItem.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{menuItem.duration}</span>
                            {menuItem.isNew && (
                              <span className="bg-orange-400 text-white px-2 py-1 rounded-full text-xs">新規</span>
                            )}
                            {menuItem.isPopular && (
                              <span className="bg-pink-400 text-white px-2 py-1 rounded-full text-xs">人気</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{menuItem.description}</p>
                      <div className="flex gap-2">
                        <Link 
                          href={`/reservation?menu=${menuItem.id}&result=${result}`}
                          className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition flex-1 text-center"
                        >
                          このメニューで予約
                        </Link>
                        <button 
                          onClick={() => setSelectedMenuItem(menuItem)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-full transition"
                        >
                          詳細
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* メニュー一覧セクション */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* タブナビゲーション */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              すべてのメニュー
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === 'recommended'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              おすすめ
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === 'popular'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              人気メニュー
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === 'new'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              新規限定
            </button>
            <button
              onClick={() => setActiveTab('limited')}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === 'limited'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              期間限定
            </button>
          </div>

          {/* メニューグリッド */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {getFilteredMenuItems().map((menuItem) => (
              <div key={menuItem.id} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-2 hover:shadow-xl transition-shadow">
                <div className="relative mb-3">
                  <div className="w-full h-32 bg-gradient-to-br from-pink-200 to-rose-300 rounded-xl flex items-center justify-center">
                    <i className="ri-spa-line text-4xl text-white"></i>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {menuItem.isNew && (
                      <span className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">新規</span>
                    )}
                    {menuItem.isPopular && (
                      <span className="bg-pink-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">人気</span>
                    )}
                    {menuItem.isLimited && (
                      <span className="bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">限定</span>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-lg font-bold text-pink-600">¥{menuItem.price.toLocaleString()}</span>
                    {menuItem.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-1">¥{menuItem.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-bold text-gray-800 line-clamp-2 mb-1">
                    {menuItem.title}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {menuItem.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-600 line-clamp-3 mb-2">
                    {menuItem.description}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <i className="ri-time-line"></i>
                    <span>{menuItem.duration}</span>
                    {menuItem.expiration && (
                      <>
                        <i className="ri-calendar-line"></i>
                        <span>{menuItem.expiration}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <Link 
                      href={`/reservation?menu=${menuItem.id}${result ? `&result=${result}` : ''}`}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded-full transition flex-1 text-center"
                    >
                      予約する
                    </Link>
                    <button 
                      onClick={() => setSelectedMenuItem(menuItem)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-full transition"
                    >
                      詳細
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* メニューが見つからない場合 */}
          {getFilteredMenuItems().length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-search-line text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">メニューが見つかりません</h3>
              <p className="text-gray-600">他のタブをお試しください</p>
            </div>
          )}
        </div>
      </section>

      {/* メニュー詳細モーダル */}
      {selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{selectedMenuItem.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-pink-600">¥{selectedMenuItem.price.toLocaleString()}</span>
                    {selectedMenuItem.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">¥{selectedMenuItem.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{selectedMenuItem.duration}</span>
                    {selectedMenuItem.isNew && (
                      <span className="bg-orange-400 text-white px-2 py-1 rounded-full text-xs">新規</span>
                    )}
                    {selectedMenuItem.isPopular && (
                      <span className="bg-pink-400 text-white px-2 py-1 rounded-full text-xs">人気</span>
                    )}
                    {selectedMenuItem.isLimited && (
                      <span className="bg-red-400 text-white px-2 py-1 rounded-full text-xs">限定</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMenuItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl md:text-2xl cursor-pointer p-2"
                >
                  <i className="ri-close-line w-5 h-5 md:w-6 md:h-6 flex items-center justify-center"></i>
                </button>
              </div>

              <div className="w-full h-48 md:h-64 bg-gradient-to-br from-pink-200 to-rose-300 relative overflow-hidden rounded-lg mb-4 md:mb-6 flex items-center justify-center">
                <i className="ri-spa-line text-6xl text-white"></i>
              </div>

              <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">メニュー内容</h4>
                  <ul className="space-y-2 mb-4 md:mb-6">
                    {selectedMenuItem.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600 text-sm md:text-base">
                        <i className="ri-check-line text-green-500 mr-2 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">カテゴリー</h4>
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                    {selectedMenuItem.tags.map((tag, index) => (
                      <span key={index} className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">利用条件</h4>
                  {selectedMenuItem.conditions && selectedMenuItem.conditions.length > 0 ? (
                    <ul className="space-y-2 mb-4 md:mb-6">
                      {selectedMenuItem.conditions.map((condition, index) => (
                        <li key={index} className="flex items-center text-gray-600 text-sm md:text-base">
                          <i className="ri-information-line text-blue-500 mr-2 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center"></i>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">特になし</p>
                  )}

                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800 text-sm md:text-base">施術時間</span>
                      <span className="text-gray-600 text-sm md:text-base">{selectedMenuItem.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800 text-sm md:text-base">料金</span>
                      <span className="text-lg md:text-xl font-bold text-pink-600">¥{selectedMenuItem.price.toLocaleString()}</span>
                    </div>
                    {selectedMenuItem.expiration && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-gray-800 text-sm md:text-base">有効期限</span>
                        <span className="text-gray-600 text-sm md:text-base">{selectedMenuItem.expiration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 md:pt-6 mt-4 md:mt-6">
                <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
                  {selectedMenuItem.description}
                </p>
                <div className="text-center">
                  <Link 
                    href={`/reservation?menu=${selectedMenuItem.id}${result ? `&result=${result}` : ''}`}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center"
                  >
                    このメニューを予約する
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 px-4">
            どのメニューが合うか分からない？
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-4">
            体質診断で、あなたにぴったりのメニューを見つけましょう
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/diagnosis" className="bg-pink-500 hover:bg-pink-600 text-white px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center">
              体質診断を受ける
            </Link>
            <Link href="/reservation" className="bg-white hover:bg-gray-50 text-pink-600 border-2 border-pink-500 px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold transition-all inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center">
              直接予約する
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
                <li><Link href="/menu" className="hover:text-white transition-colors cursor-pointer">メニュー</Link></li>
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