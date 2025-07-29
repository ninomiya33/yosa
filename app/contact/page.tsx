'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('必須項目をすべて入力してください。');
      return;
    }

    // メッセージの文字数制限チェック
    if (formData.message.length > 500) {
      alert('メッセージは500文字以内で入力してください。');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('お問い合わせの送信に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('お問い合わせ送信エラー:', error);
      alert('お問い合わせの送信に失敗しました。もう一度お試しください。');
    }
  };

  const subjects = [
    { value: '', label: '選択してください' },
    { value: 'reservation', label: '予約について' },
    { value: 'service', label: 'サービス内容について' },
    { value: 'pricing', label: '料金について' },
    { value: 'first-time', label: '初回利用について' },
    { value: 'health', label: '健康状態・体質について' },
    { value: 'access', label: 'アクセス・営業時間について' },
    { value: 'other', label: 'その他' }
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
              <Link href="/reservation" className="text-gray-700 hover:text-green-700 transition-colors cursor-pointer">予約</Link>
              <Link href="/contact" className="text-green-700 font-semibold cursor-pointer">お問い合わせ</Link>
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
                  className="block py-3 text-gray-700 hover:text-green-700 transition-colors border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  予約
                </Link>
                <Link 
                  href="/contact" 
                  className="block py-3 text-green-700 font-semibold"
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
              <h1 className="text-3xl font-bold text-gray-800 mb-4">お問い合わせを受け付けました</h1>
              <p className="text-lg text-gray-600 mb-8">
                お問い合わせありがとうございます。<br />
                内容を確認次第、2営業日以内にご連絡いたします。<br />
                お急ぎの場合は、お電話またはLINEにてお問い合わせください。
              </p>
              <div className="space-y-4">
                <Link href="/" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all inline-block whitespace-nowrap cursor-pointer">
                  ホームに戻る
                </Link>
                <br />
                <Link href="/reservation" className="text-pink-500 hover:text-pink-600 font-semibold transition-colors cursor-pointer">
                  予約をする
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
            <Link href="/reservation" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">予約</Link>
            <Link href="/contact" className="text-pink-600 font-semibold cursor-pointer">お問い合わせ</Link>
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
                href="/reservation" 
                className="block py-3 text-gray-700 hover:text-pink-600 transition-colors border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                予約
              </Link>
              <Link 
                href="/contact" 
                className="block py-3 text-pink-600 font-semibold"
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
        backgroundImage: `url('https://readdy.ai/api/search-image?query=peaceful%20japanese%20spa%20consultation%20room%20with%20natural%20wood%20desk%20and%20comfortable%20seating%2C%20soft%20warm%20lighting%2C%20minimalist%20design%2C%20zen%20atmosphere%2C%20bamboo%20plants%20and%20stone%20accents%2C%20professional%20wellness%20consultation%20space%2C%20calming%20neutral%20colors%2C%20modern%20clean%20aesthetic&width=1200&height=400&seq=contact-hero&orientation=landscape')`
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            お問い合わせ
          </h1>
          <p className="text-xl text-white opacity-90">
            ご不明な点がございましたら、お気軽にお問い合わせください
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">お問い合わせ方法</h2>
            <p className="text-gray-600">お好みの方法でお問い合わせください</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-phone-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">お電話</h3>
              <p className="text-2xl font-bold text-pink-600 mb-2">03-1234-5678</p>
              <p className="text-gray-600 mb-4">
                営業時間: 10:00-19:00<br />
                定休日: 毎週水曜日
              </p>
              <p className="text-sm text-gray-500">
                お急ぎの場合は、お電話が最も早く対応できます
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-line-fill text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">LINE</h3>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full mb-4 transition-colors cursor-pointer whitespace-nowrap">
                友だち追加
              </button>
              <p className="text-gray-600 mb-4">
                24時間受付<br />
                返信: 営業時間内
              </p>
              <p className="text-sm text-gray-500">
                画像付きでご質問いただけます
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-mail-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">メール</h3>
              <p className="text-lg font-semibold text-blue-600 mb-2">info@yomogi.jp</p>
              <p className="text-gray-600 mb-4">
                24時間受付<br />
                返信: 2営業日以内
              </p>
              <p className="text-sm text-gray-500">
                詳しい内容はメールでお送りください
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">お問い合わせフォーム</h2>
              <p className="text-gray-600">下記のフォームに必要事項をご記入ください</p>
            </div>

            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
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
                  電話番号（任意）
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  placeholder="090-1234-5678"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  お問い合わせ項目 <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm pr-8"
                >
                  {subjects.map(subject => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contactMethod" className="block text-sm font-semibold text-gray-700 mb-2">
                  ご希望の返信方法
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={formData.contactMethod === 'email'}
                      onChange={handleInputChange}
                      className="mr-2 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">メール</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={formData.contactMethod === 'phone'}
                      onChange={handleInputChange}
                      className="mr-2 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">電話</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="line"
                      checked={formData.contactMethod === 'line'}
                      onChange={handleInputChange}
                      className="mr-2 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">LINE</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm resize-none"
                  placeholder="お問い合わせの内容を詳しくお聞かせください..."
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.message.length}/500文字
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">お問い合わせに関するご案内</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <i className="ri-time-line text-blue-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    メールでのお問い合わせは2営業日以内にご返信いたします
                  </li>
                  <li className="flex items-start">
                    <i className="ri-phone-line text-green-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    お急ぎの場合は、お電話でのお問い合わせをおすすめします
                  </li>
                  <li className="flex items-start">
                    <i className="ri-shield-check-line text-purple-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    個人情報は適切に管理し、お問い合わせ対応のみに使用いたします
                  </li>
                  <li className="flex items-start">
                    <i className="ri-calendar-line text-orange-500 mr-2 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                    営業時間外のお問い合わせは翌営業日以降の対応となります
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
                >
                  お問い合わせを送信
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">よくあるご質問</h2>
            <p className="text-gray-600">お問い合わせの前に、こちらもご確認ください</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <i className="ri-question-line text-pink-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                初めてでも安心して利用できますか？
              </h3>
              <p className="text-gray-600">
                はい、初回の方には丁寧にご説明いたします。体質診断から始めて、あなたに最適なブレンドをご提案しますので、安心してご利用ください。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <i className="ri-question-line text-pink-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                どのくらいの頻度で通うのが効果的ですか？
              </h3>
              <p className="text-gray-600">
                個人差はありますが、週1〜2回のペースで継続していただくことをおすすめしています。体調や目的に応じて最適な頻度をご提案いたします。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <i className="ri-question-line text-pink-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                妊娠中でも利用できますか？
              </h3>
              <p className="text-gray-600">
                妊娠中の方は、必ず事前にかかりつけの医師にご相談ください。医師の許可があれば、妊娠期に適したブレンドをご用意いたします。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <i className="ri-question-line text-pink-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                予約のキャンセルはいつまで可能ですか？
              </h3>
              <p className="text-gray-600">
                ご予約の変更・キャンセルは、前日までにご連絡ください。当日キャンセルの場合は、キャンセル料が発生する場合がございます。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <i className="ri-question-line text-pink-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                持参するものはありますか？
              </h3>
              <p className="text-gray-600">
                タオル類は全てご用意しておりますので、特別にお持ちいただくものはございません。リラックスできる服装でお越しください。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <i className="ri-question-line text-pink-500 mr-2 w-5 h-5 flex items-center justify-center"></i>
                駐車場はありますか？
              </h3>
              <p className="text-gray-600">
                専用駐車場を2台分ご用意しております。満車の場合は、近隣のコインパーキングをご利用ください。駐車料金の一部を負担いたします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Info */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">アクセス・営業時間</h2>
            <p className="text-gray-600">お気軽にお越しください</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">店舗情報</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="ri-map-pin-line text-pink-500 mr-3 mt-1 w-5 h-5 flex items-center justify-center"></i>
                  <div>
                    <p className="font-semibold text-gray-800">住所</p>
                    <p className="text-gray-600">〒150-0001<br />東京都渋谷区神宮前1-2-3<br />ウェルネスビル2階</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <i className="ri-time-line text-blue-500 mr-3 mt-1 w-5 h-5 flex items-center justify-center"></i>
                  <div>
                    <p className="font-semibold text-gray-800">営業時間</p>
                    <p className="text-gray-600">10:00 - 19:00<br />（最終受付 18:00）</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <i className="ri-calendar-line text-green-500 mr-3 mt-1 w-5 h-5 flex items-center justify-center"></i>
                  <div>
                    <p className="font-semibold text-gray-800">定休日</p>
                    <p className="text-gray-600">毎週水曜日<br />祝日の場合は翌日</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <i className="ri-train-line text-purple-500 mr-3 mt-1 w-5 h-5 flex items-center justify-center"></i>
                  <div>
                    <p className="font-semibold text-gray-800">アクセス</p>
                    <p className="text-gray-600">JR山手線「原宿駅」徒歩5分<br />東京メトロ「明治神宮前駅」徒歩3分</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">地図</h3>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.0247647493896!2d139.70266831525866!3d35.66987703020011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ca40932d907%3A0x8bc0d7d1c5b4b9c8!2z44CSMTUwLTAwMDEg5p2x5Lqs6YO95riL6LC35Yy656We5a6u5YmNMS0yLTM!5e0!3m2!1sja!2sjp!4v1616161616161!5m2!1sja!2sjp"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                  loading="lazy"
                  title="よもぎ蒸しサロンの地図"
                ></iframe>
              </div>
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