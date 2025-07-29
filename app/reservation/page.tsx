'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import WeeklyCalendar from './WeeklyCalendar';
import { getAllMenuItems, getMenuRecommendations, type MenuItem } from '../lib/menuRecommendations';

// 体質タイプとブレンドのマッピング
const bodyTypeToBlend = {
  cold: 'warming',
  stress: 'relaxing',
  swelling: 'detox',
  hormone: 'hormone',
  digestive: 'digestive',
  sleep: 'sleep',
  skin: 'skin',
  balanced: 'balanced'
};

// ブレンド情報
const blendOptions = [
  {
    id: 'warming',
    value: 'warming',
    label: '温活ブレンド',
    subtitle: '冷え性・血行不良の方に',
    description: 'トウキ、ケイヒ、センキュウを配合した温活ブレンドで、体の芯から温めて血行促進をサポートします。',
    ingredients: ['ガイヨウ', 'トウキ', 'ケイヒ', 'センキュウ'],
    effects: ['体温上昇', '血行促進', '冷え性改善', '新陳代謝向上'],
    price: '¥6,000',
    color: 'orange',
    icon: 'ri-fire-line'
  },
  {
    id: 'relaxing',
    value: 'relaxing',
    label: 'リラックスブレンド',
    subtitle: 'ストレス・疲労の方に',
    description: 'カミツレ、ウイキョウ、チンビを配合したリラックスブレンドで、心身の緊張を解きほぐし深いリラクゼーションを促します。',
    ingredients: ['ガイヨウ', 'カミツレ', 'ウイキョウ', 'チンビ'],
    effects: ['リラックス', 'ストレス解消', '睡眠改善', '自律神経調整'],
    price: '¥6,500',
    color: 'purple',
    icon: 'ri-emotion-line'
  },
  {
    id: 'detox',
    value: 'detox',
    label: 'デトックスブレンド',
    subtitle: 'むくみ・水分代謝の方に',
    description: 'インチンコウ、ビャクシ、ガイヨウを配合したデトックスブレンドで、余分な水分を排出し体内をクレンジングします。',
    ingredients: ['ガイヨウ', 'インチンコウ', 'ビャクシ', 'センキュウ'],
    effects: ['デトックス', 'むくみ改善', '利尿作用', '老廃物排出'],
    price: '¥6,500',
    color: 'blue',
    icon: 'ri-drop-line'
  },
  {
    id: 'hormone',
    value: 'hormone',
    label: '女性ケアブレンド',
    subtitle: 'ホルモンバランスの方に',
    description: 'トウキ、センキュウ、ガイヨウを配合した女性ケアブレンドで、女性ホルモンを整え女性特有の不調をケアします。',
    ingredients: ['ガイヨウ', 'トウキ', 'センキュウ', 'ケイヒ'],
    effects: ['ホルモンバランス調整', '生理不順改善', 'PMS緩和', '女性機能向上'],
    price: '¥7,000',
    color: 'pink',
    icon: 'ri-heart-line'
  },
  {
    id: 'digestive',
    value: 'digestive',
    label: '胃腸ケアブレンド',
    subtitle: '消化器系の方に',
    description: 'カミツレ、ウイキョウ、ビャクシを配合した胃腸ケアブレンドで、消化器系の働きを改善し胃腸を整えます。',
    ingredients: ['ガイヨウ', 'カミツレ', 'ウイキョウ', 'ビャクシ'],
    effects: ['消化促進', '胃腸調整', '食欲改善', '便秘解消'],
    price: '¥6,000',
    color: 'yellow',
    icon: 'ri-heart-pulse-line'
  },
  {
    id: 'sleep',
    value: 'sleep',
    label: '安眠ブレンド',
    subtitle: '睡眠障害の方に',
    description: 'カミツレ、チンビ、ウイキョウを配合した安眠ブレンドで、質の良い睡眠をサポートし心身の回復を促します。',
    ingredients: ['ガイヨウ', 'カミツレ', 'チンビ', 'ウイキョウ'],
    effects: ['睡眠改善', 'リラックス', 'ストレス解消', '心身回復'],
    price: '¥6,500',
    color: 'indigo',
    icon: 'ri-moon-line'
  },
  {
    id: 'skin',
    value: 'skin',
    label: '美肌ブレンド',
    subtitle: '美容効果を求める方に',
    description: 'インチンコウ、センキュウ、ガイヨウを配合した美肌ブレンドで、肌の調子を整え美しさを引き出します。',
    ingredients: ['ガイヨウ', 'インチンコウ', 'センキュウ', 'トウキ'],
    effects: ['美肌効果', '肌荒れ改善', 'アンチエイジング', '保湿'],
    price: '¥7,000',
    color: 'rose',
    icon: 'ri-star-line'
  },
  {
    id: 'balanced',
    value: 'balanced',
    label: 'バランスブレンド',
    subtitle: '全体のバランスを整えたい方に',
    description: 'ガイヨウ、チンビ、ウイキョウを配合したバランスブレンドで、心身のバランスを整えます。',
    ingredients: ['ガイヨウ', 'チンビ', 'ウイキョウ', 'カミツレ'],
    effects: ['バランス調整', 'リフレッシュ', 'ストレス緩和', '全体調整'],
    price: '¥6,000',
    color: 'green',
    icon: 'ri-leaf-line'
  }
];

function ReservationContent() {
  const searchParams = useSearchParams();
  const diagnosisResult = searchParams.get('result');
  const selectedMenu = searchParams.get('menu');
  const recommendedBlend = diagnosisResult ? bodyTypeToBlend[diagnosisResult as keyof typeof bodyTypeToBlend] : null;

  // メニュー情報を取得
  const allMenuItems = getAllMenuItems();
  const selectedMenuItem = selectedMenu ? allMenuItems.find(item => item.id === selectedMenu) : null;
  const menuRecommendation = diagnosisResult ? getMenuRecommendations(diagnosisResult) : null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    menu: selectedMenu || '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{date: string, time: string} | null>(null);




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // フォームデータの検証
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      alert('必須項目をすべて入力してください。');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      if (formData.menu) {
        formDataToSend.append('menu', formData.menu);
      }
      if (formData.message) {
        formDataToSend.append('message', formData.message);
      }

      const response = await fetch('/api/reservation', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('予約成功:', result);
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(`予約の送信に失敗しました: ${errorData.error}`);
      }
    } catch (error) {
      console.error('予約送信エラー:', error);
      alert('予約の送信に失敗しました。もう一度お試しください。');
    }
  };

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];



  if (isSubmitted) {
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
              <Link href="/" className="text-gray-700 hover:text-green-700 transition-colors cursor-pointer">ホーム</Link>
              <Link href="/diagnosis" className="text-gray-700 hover:text-green-700 transition-colors cursor-pointer">体質診断</Link>
              <Link href="/blends" className="text-gray-700 hover:text-green-700 transition-colors cursor-pointer">ハーブ紹介</Link>
              <Link href="/reservation" className="text-green-700 font-semibold cursor-pointer">予約</Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-700 transition-colors cursor-pointer">お問い合わせ</Link>
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
                  className="block py-3 text-gray-700 hover:text-green-700 transition-colors border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ハーブ紹介
                </Link>
                <Link 
                  href="/reservation" 
                  className="block py-3 text-green-700 font-semibold border-b border-gray-100"
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

        {/* Success Message */}
        <div className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-check-line text-green-500 text-3xl w-10 h-10 flex items-center justify-center"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">予約が完了しました！</h1>
              <p className="text-lg text-gray-600 mb-8">
                ご予約ありがとうございます。<br />
                確認メールを送信いたしましたので、ご確認ください。<br />
                ご質問がございましたら、お気軽にお問い合わせください。
              </p>
              <div className="space-y-4">
                <Link href="/" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all inline-block whitespace-nowrap cursor-pointer">
                  ホームに戻る
                </Link>
                <br />
                <Link href="/diagnosis" className="text-pink-500 hover:text-pink-600 font-semibold transition-colors cursor-pointer">
                  体質診断をもう一度受ける
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <Link href="/menu" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">メニュー</Link>
            <Link href="/reservation" className="text-pink-600 font-semibold cursor-pointer">予約</Link>
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
                  ブレンド紹介
                </Link>
                <Link 
                  href="/menu" 
                  className="block py-3 text-gray-700 hover:text-pink-600 transition-colors border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  メニュー
                </Link>
                <Link 
                  href="/reservation" 
                  className="block py-3 text-pink-600 font-semibold border-b border-gray-100"
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
      <section className="relative py-16 px-4 text-center bg-cover bg-center" style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=elegant%20japanese%20spa%20reception%20desk%20with%20natural%20wood%20elements%2C%20soft%20warm%20lighting%2C%20minimalist%20design%2C%20appointment%20booking%20area%2C%20zen%20atmosphere%2C%20bamboo%20and%20stone%20accents%2C%20peaceful%20wellness%20environment%2C%20clean%20modern%20aesthetic%2C%20calming%20neutral%20colors&width=1200&height=400&seq=reservation-hero&orientation=landscape')`
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ご予約
          </h1>
          <p className="text-xl text-white opacity-90">
            あなたにぴったりのよもぎ蒸しをご予約ください
          </p>
        </div>
      </section>



      {/* Selected Menu Info */}
      {selectedMenuItem && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-spa-line text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">選択されたメニュー</h3>
                    <p className="text-blue-700">{selectedMenuItem.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-blue-600">¥{selectedMenuItem.price.toLocaleString()}</span>
                      <span className="text-sm text-blue-600">{selectedMenuItem.duration}</span>
                    </div>
                  </div>
                </div>
                <Link 
                  href="/menu"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  メニュー変更
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reservation Form */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">予約フォーム</h2>
              <p className="text-gray-600">必要な情報をご入力ください</p>
            </div>

            <form id="reservation-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    placeholder="山田 花子"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  placeholder="090-1234-5678"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  希望日時 <span className="text-red-500">*</span>
                </label>
                <WeeklyCalendar
                  selected={selectedSlot}
                  onSelect={(date, time) => {
                    setSelectedSlot({ date, time });
                    setFormData(prev => ({ ...prev, date, time }));
                  }}
                />
                {(!selectedSlot || !selectedSlot.date || !selectedSlot.time) && (
                  <p className="text-sm text-rose-600 mt-2">日時を選択してください</p>
                )}
              </div>

              {/* ブレンド選択セクション */}


              {/* メニュー選択セクション */}
              <div>
                <label htmlFor="menu" className="block text-sm font-semibold text-gray-700 mb-2">
                  メニュー選択
                </label>
                <div className="space-y-3">
                  {/* 選択されたメニューがある場合 */}
                  {selectedMenuItem && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <i className="ri-spa-line text-blue-600 text-lg"></i>
                            <div className="font-semibold text-gray-800">{selectedMenuItem.title}</div>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                              選択済み
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{selectedMenuItem.category}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{selectedMenuItem.description}</div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-wrap gap-1">
                              {selectedMenuItem.features.slice(0, 2).map((feature, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                            <div className="text-sm font-semibold text-blue-600">¥{selectedMenuItem.price.toLocaleString()}</div>
                          </div>
                        </div>
                        <Link 
                          href="/menu"
                          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                        >
                          変更
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* 診断結果からのおすすめメニュー */}
                  {menuRecommendation && !selectedMenuItem && (
                    <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">診断結果からのおすすめメニュー</h4>
                      <div className="space-y-2">
                        {menuRecommendation.primaryRecommendations.slice(0, 2).map((menuItem) => (
                          <div key={menuItem.id} className="bg-white rounded-lg p-3 border border-pink-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-sm mb-1">{menuItem.title}</div>
                                <div className="text-xs text-gray-600 mb-1">{menuItem.description}</div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">{menuItem.duration}</span>
                                  <span className="text-sm font-semibold text-pink-600">¥{menuItem.price.toLocaleString()}</span>
                                </div>
                              </div>
                              <Link 
                                href={`/reservation?menu=${menuItem.id}&result=${diagnosisResult}`}
                                className="ml-2 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                              >
                                選択
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <Link 
                          href={`/menu?result=${diagnosisResult}`}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                        >
                          全メニューを見る
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* メニューを選択していない場合の案内 */}
                  {!selectedMenuItem && !menuRecommendation && (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
                      <i className="ri-spa-line text-gray-400 text-2xl mb-2"></i>
                      <p className="text-gray-600 text-sm mb-3">メニューを選択すると、より詳細な予約ができます</p>
                      <Link 
                        href="/menu"
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                      >
                        メニューを見る
                      </Link>
                    </div>
                  )}
                </div>
              </div>



              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  ご質問・ご要望（任意）
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm resize-none"
                  placeholder="初回利用です、不安なことがあれば教えてください..."
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.message.length}/500文字
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ご予約に関する注意事項</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <i className="ri-information-line text-blue-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    予約確定後、確認メールをお送りします
                  </li>
                  <li className="flex items-start">
                    <i className="ri-time-line text-green-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    施術時間は約60分です
                  </li>
                  <li className="flex items-start">
                    <i className="ri-phone-line text-purple-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    変更・キャンセルは前日までにご連絡ください
                  </li>
                  <li className="flex items-start">
                    <i className="ri-heart-line text-pink-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    妊娠中の方は事前にご相談ください
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
                >
                  予約を確定する
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">お困りの際は</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-phone-line text-pink-500 text-xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">お電話</h3>
              <p className="text-gray-600">03-1234-5678</p>
              <p className="text-sm text-gray-500">営業時間: 10:00-19:00</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-line-fill text-green-500 text-xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">LINE</h3>
              <button className="text-green-600 hover:text-green-700 transition-colors cursor-pointer">
                友だち追加
              </button>
              <p className="text-sm text-gray-500">24時間受付</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-line text-blue-500 text-xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">メール</h3>
              <p className="text-gray-600">info@yomogi.jp</p>
              <p className="text-sm text-gray-500">24時間受付</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Pacifico, serif' }}>
                よもぎ蒸し
              </div>
              <p className="text-gray-400">
                自然の恵みで心と体を癒す、伝統的なよもぎ蒸しサロン
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">メニュー</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors cursor-pointer">ホーム</Link></li>
                <li><Link href="/diagnosis" className="hover:text-white transition-colors cursor-pointer">体質診断</Link></li>
                <li><Link href="/blends" className="hover:text-white transition-colors cursor-pointer">ハーブ紹介</Link></li>
                <li><Link href="/reservation" className="hover:text-white transition-colors cursor-pointer">予約</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
              <ul className="space-y-2 text-gray-400">
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
              <h3 className="text-lg font-semibold mb-4">SNS</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="ri-line-fill text-xl w-6 h-6 flex items-center justify-center"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="ri-instagram-line text-xl w-6 h-6 flex items-center justify-center"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="ri-twitter-line text-xl w-6 h-6 flex items-center justify-center"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 よもぎ蒸しサロン. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <ReservationContent />
    </Suspense>
  );
}