// 診断結果に基づくメニュー推薦システム

export interface MenuItem {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  image: string;
  tags: string[];
  features: string[];
  conditions?: string[];
  expiration?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isLimited?: boolean;
}

export interface MenuRecommendation {
  bodyType: string;
  primaryRecommendations: MenuItem[];
  secondaryRecommendations: MenuItem[];
  explanation: string;
  benefits: string[];
}

// 実際のメニューデータ（画像から抽出）
export const menuItems: MenuItem[] = [
  // 1番人気コース
  {
    id: 'body-reset-course',
    title: '1番人気!しっかり体質リセットコース!ボディメイクマッサージ付き劇的変身',
    category: 'ボディトリ',
    description: '全身リンパ+水素足湯+ルルオン45分+ボディメイク付き。冷え性の方に特におすすめの「すごい」水素足湯。特定部位のボディケアで結果を重視する方の贅沢コース。',
    price: 7200,
    originalPrice: 9800,
    duration: '90分',
    image: '/images/menu/body-reset.jpg',
    tags: ['ボディトリ', 'ボディケア', '足裏・リフレ', 'ヘッド', 'ボディ', 'その他'],
    features: ['全身リンパマッサージ', '水素足湯', 'ルルオン45分', 'ボディメイクマッサージ'],
    conditions: ['予約時・入店時に提示', '新規限定'],
    expiration: '2025年7月末日まで',
    isNew: true,
    isPopular: true
  },
  // 2番人気コース
  {
    id: 'weight-loss-facial',
    title: '2番人気【大満足の20%オフ】痩せるだけじゃない! 小顔美肌フェイシャルつき',
    category: 'ボディトリ',
    description: '全身リンパマッサージ+水素足湯+ルルオン60分+柔らかくなった脂肪を全身造形マッサージでお仕上げ!+水素美顔。本気で痩せたい方に「脂肪燃焼! 滝汗デトックス!」',
    price: 10400,
    duration: '120分',
    image: '/images/menu/weight-loss-facial.jpg',
    tags: ['ボディトリ', 'ボディケア', 'ボディ', 'ブライダル'],
    features: ['全身リンパマッサージ', '水素足湯', 'ルルオン60分', '全身造形マッサージ', '水素美顔'],
    conditions: ['予約時・入店時に提示', '新規限定'],
    expiration: '2025年7月末日まで',
    isNew: true,
    isPopular: true
  },
  // ベーシックコース
  {
    id: 'basic-metabolism',
    title: '【らくらく代謝アップ】ルルオン60分+全身リンパ流しのベーシックコースです',
    category: 'ボディトリ',
    description: '全身リンパマッサージ15分+ルルオン60分。冷え/むくみ/女性特有のお悩みに◎。体中の深いリンパを流してスッキリ感を実感。最強デトックスルルオン(こだわりよもぎ蒸し)で美ボディに。',
    price: 5000,
    duration: '75分',
    image: '/images/menu/basic-metabolism.jpg',
    tags: ['ボディトリ', 'ボディケア', '足裏・リフレ', 'ボディ', 'その他'],
    features: ['全身リンパマッサージ15分', 'ルルオン60分'],
    conditions: ['予約時・入店時に提示', '新規限定'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // 超最強痩身コース
  {
    id: 'super-slimming-premium',
    title: '超最強痩身水素プレミアム! 本気痩せならHHOガスつきで最強燃焼痩身を!',
    category: 'ボディ',
    description: '水素酸素吸入60分+ルルオン60分同時進行+リンパマッサージ+水素足湯+ボディメイクマッサージ。最強痩身コース。有酸素運動と女性温活を組み合わせた痩身で「絶対痩せ」を実現。',
    price: 12600,
    duration: '120分',
    image: '/images/menu/super-slimming.jpg',
    tags: ['ボディ'],
    features: ['水素酸素吸入60分', 'ルルオン60分', 'リンパマッサージ', '水素足湯', 'ボディメイクマッサージ'],
    conditions: ['予約必須', '新規限定'],
    expiration: '2025年7月末日まで',
    isNew: true,
    isPopular: true
  },
  // くびれ・セル脂肪対策
  {
    id: 'waistline-cellulite',
    title: 'くびれが欲しいセル脂肪が気になる等お悩み1つ解決 9600円→8000円',
    category: 'ボディ',
    description: '1つのお悩みに集中したマッサージ。くびれが欲しい、太もものセル脂肪が気になる、二の腕を細くしたいなど。',
    price: 8000,
    originalPrice: 9600,
    duration: '60分',
    image: '/images/menu/waistline-cellulite.jpg',
    tags: ['ボディ'],
    features: ['集中マッサージ', '部位別ケア'],
    conditions: ['予約必須', '1ヶ月以内使用'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // 3回コース
  {
    id: 'transformation-3course',
    title: '【期間限定】劇的!変身応援3回コース',
    category: 'ボディトリ',
    description: '進化したよもぎ蒸し「ルルオン」を3日連続または1週間以内に3回。体に変化を感じる人気No.1コース。',
    price: 20000,
    duration: '3回分',
    image: '/images/menu/transformation-3course.jpg',
    tags: ['ボディトリ', 'ボディケア', 'ボディ', 'ブライダル', 'その他'],
    features: ['ルルオン3回', '進化したよもぎ蒸し'],
    conditions: ['予約時・入店時に提示', '誰でも利用可能'],
    expiration: '2025年7月末日まで',
    isNew: true,
    isLimited: true
  },
  // 1週間短期コース
  {
    id: '1week-intensive',
    title: 'イベント前1週間短期コース(5日)ホームケアつき♪',
    category: 'ボディ',
    description: '1週間で5回の集中コース。イベント前に急いで痩せたい方に。むくみを解消して痩せボディに。目に見える体重減。セリテラで美脚も。',
    price: 55000,
    originalPrice: 91000,
    duration: '5日間',
    image: '/images/menu/1week-intensive.jpg',
    tags: ['ボディ'],
    features: ['5回集中コース', 'ホームケア付き', 'セリテラ'],
    conditions: ['予約必須', '1週間以内に5日参加可能な方'],
    expiration: '2025年7月末日まで',
    isNew: true,
    isLimited: true
  },
  // フェイシャル
  {
    id: 'facial-skin-care',
    title: '肌トラブル改善! 美肌目指す水素スチーム炭酸パックつき',
    category: 'フェイシャル',
    description: '水素洗顔+リンパマッサージ+ルルオン45分+エアーG(水素スチーム)45分+水素化粧品で水素フェイシャル。炭酸パック(3000円相当)を夜のホームケアで使用。肌トラブルを徹底的にアプローチ。',
    price: 8000,
    originalPrice: 10500,
    duration: '90分',
    image: '/images/menu/facial-skin-care.jpg',
    tags: ['フェイシャル'],
    features: ['水素洗顔', 'リンパマッサージ', 'ルルオン45分', 'エアーG45分', '水素フェイシャル', '炭酸パック'],
    conditions: ['予約時・入店時に提示', '新規限定'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // 妊婦限定
  {
    id: 'pregnant-women',
    title: '妊婦さん限定 【妊娠中の冷え・むくみ対策に◎90分',
    category: 'ボディトリ',
    description: '安定期の妊婦さんにおすすめ。ルルオン60分+水素足湯15分+糖鎖サプリメント。子宮をしっかり温めてホルモンバランスを整える。女性特有のお悩みに効果的。',
    price: 5000,
    originalPrice: 6250,
    duration: '90分',
    image: '/images/menu/pregnant-women.jpg',
    tags: ['ボディトリ', 'ボディケア', 'ボディ', 'その他'],
    features: ['ルルオン60分', '水素足湯15分', '糖鎖サプリメント'],
    conditions: ['予約時・入店時に提示', '妊婦限定'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // ペア割温活コース
  {
    id: 'pair-warmup',
    title: 'ペア割温活コース(リンパマッサージ+ルルオン45分) 2人で',
    category: 'ボディケア',
    description: 'お友達、ご家族、カップル、パートナーで。体の芯から温めて免疫力アップ。',
    price: 8000,
    originalPrice: 12500,
    duration: '60分',
    image: '/images/menu/pair-warmup.jpg',
    tags: ['ボディケア'],
    features: ['リンパマッサージ', 'ルルオン45分', 'ペア割引'],
    conditions: ['予約時・入店時に提示', '2人での利用'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // 温活ルルオン体験
  {
    id: 'warmup-lulon-experience',
    title: '【子宮から冷え改善◎】温活ルルオン体験。こだわりよもぎ蒸しを体験できます',
    category: 'ボディトリ',
    description: 'ルルオン45分。リラックスしたい方、温活したい方におすすめ。疲れた心と体へのご褒美。カウンセリング込みで約80分。こだわりよもぎ蒸しを体験。',
    price: 4000,
    duration: '80分',
    image: '/images/menu/warmup-lulon-experience.jpg',
    tags: ['ボディトリ', 'ボディケア', '足裏・リフレ', 'ボディ', 'その他'],
    features: ['ルルオン45分', 'カウンセリング'],
    conditions: ['予約時・入店時に提示', '新規限定'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // 短期集中ダイエット
  {
    id: 'short-term-diet',
    title: '短期集中 (1ヶ月)! 美ダイエット! 気になる部位を集中的に全身痩身へと',
    category: 'ボディ',
    description: '初回カウンセリングで気になる部位をお聞かせください。徹底的にアタックします!(例：二の腕)美ダイエットを成功させましょう!1ヶ月以内使用可能な11回チケット。',
    price: 90000,
    duration: '11回分',
    image: '/images/menu/short-term-diet.jpg',
    tags: ['ボディ'],
    features: ['11回チケット', '集中部位ケア', 'カウンセリング'],
    conditions: ['入店時に提示', '1ヶ月以内使用'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // 学割U24
  {
    id: 'student-discount-u24',
    title: '【学割U24】生理・女性特有のお悩みに☆ルルオン+リンパマッサージ!',
    category: 'ボディケア',
    description: '《カウンセリング → 背中リンパマッサージ 10分 → ルルオン 40分》学生さんに嬉しいコース ♪ [NETが×の場合はお電話ください]',
    price: 4000,
    duration: '50分',
    image: '/images/menu/student-discount-u24.jpg',
    tags: ['ボディケア', 'ボディ', 'その他'],
    features: ['カウンセリング', '背中リンパマッサージ10分', 'ルルオン40分'],
    conditions: ['予約時・入店時に提示', '学生証提示', '24歳以下'],
    expiration: '2025年7月末日まで',
    isNew: true
  },
  // 妊活応援ベビ待ちコース
  {
    id: 'fertility-support',
    title: '【妊活応援】ベビ待ちコース(糖鎖付)通常価格13000円→8500円',
    category: 'ボディトリ',
    description: '全身リンパマッサージでコリをほぐし、水素足湯で足を温めてルルオン60分。水素ヘッドマッサージでストレスフリーな体でママになって赤ちゃんを迎える準備をしましょう!',
    price: 8500,
    originalPrice: 13000,
    duration: '90分',
    image: '/images/menu/fertility-support.jpg',
    tags: ['ボディトリ'],
    features: ['全身リンパマッサージ', '水素足湯', 'ルルオン60分', '水素ヘッドマッサージ', '糖鎖サプリメント'],
    conditions: ['予約時提示', '1ヶ月以内使用'],
    expiration: '2025年7月末日まで',
    isNew: true
  }
];

// 体質タイプとメニューのマッピング
export const menuRecommendations: MenuRecommendation[] = [
  {
    bodyType: 'cold',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'body-reset-course')!,
      menuItems.find(item => item.id === 'warmup-lulon-experience')!,
      menuItems.find(item => item.id === 'pair-warmup')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'basic-metabolism')!,
      menuItems.find(item => item.id === 'fertility-support')!
    ],
    explanation: '冷え性タイプのあなたには、体の芯から温めるコースが最適です。水素足湯やルルオンで血行促進を促し、冷えによる不調を根本から改善します。',
    benefits: [
      '手足の冷えを改善',
      '血行促進で体を温める',
      '代謝アップで痩せやすい体に',
      '免疫力向上'
    ]
  },
  {
    bodyType: 'stress',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'relaxing-lulon')!,
      menuItems.find(item => item.id === 'basic-metabolism')!,
      menuItems.find(item => item.id === 'warmup-lulon-experience')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'pair-warmup')!,
      menuItems.find(item => item.id === 'student-discount-u24')!
    ],
    explanation: 'ストレス・疲労タイプのあなたには、リラックス効果の高いコースがおすすめです。リンパマッサージとルルオンで心身の緊張を解きほぐします。',
    benefits: [
      'ストレス解消',
      '心身のリラックス',
      '睡眠の質向上',
      '自律神経の調整'
    ]
  },
  {
    bodyType: 'swelling',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'basic-metabolism')!,
      menuItems.find(item => item.id === 'super-slimming-premium')!,
      menuItems.find(item => item.id === 'weight-loss-facial')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'waistline-cellulite')!,
      menuItems.find(item => item.id === '1week-intensive')!
    ],
    explanation: 'むくみ・水分代謝タイプのあなたには、デトックス効果の高いコースが最適です。リンパマッサージとルルオンで余分な水分を排出し、代謝を改善します。',
    benefits: [
      'むくみ解消',
      'デトックス効果',
      '代謝アップ',
      'スッキリした体感'
    ]
  },
  {
    bodyType: 'hormone',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'fertility-support')!,
      menuItems.find(item => item.id === 'pregnant-women')!,
      menuItems.find(item => item.id === 'warmup-lulon-experience')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'pair-warmup')!,
      menuItems.find(item => item.id === 'student-discount-u24')!
    ],
    explanation: 'ホルモンバランスタイプのあなたには、女性特有の不調にアプローチするコースがおすすめです。子宮を温めてホルモンバランスを整えます。',
    benefits: [
      'ホルモンバランス調整',
      '生理不順改善',
      'PMS緩和',
      '女性機能向上'
    ]
  },
  {
    bodyType: 'digestive',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'basic-metabolism')!,
      menuItems.find(item => item.id === 'warmup-lulon-experience')!,
      menuItems.find(item => item.id === 'pair-warmup')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'student-discount-u24')!,
      menuItems.find(item => item.id === 'fertility-support')!
    ],
    explanation: '消化器系タイプのあなたには、体を温めて代謝を改善するコースが最適です。ルルオンで内臓を温め、消化器系の働きをサポートします。',
    benefits: [
      '消化器系の改善',
      '代謝アップ',
      '便秘解消',
      '胃腸の調子改善'
    ]
  },
  {
    bodyType: 'sleep',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'warmup-lulon-experience')!,
      menuItems.find(item => item.id === 'pair-warmup')!,
      menuItems.find(item => item.id === 'student-discount-u24')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'basic-metabolism')!,
      menuItems.find(item => item.id === 'fertility-support')!
    ],
    explanation: '睡眠障害タイプのあなたには、リラックス効果の高いコースがおすすめです。ルルオンで心身をリラックスさせ、質の良い睡眠をサポートします。',
    benefits: [
      '睡眠の質向上',
      'リラックス効果',
      'ストレス解消',
      '心身の回復'
    ]
  },
  {
    bodyType: 'skin',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'facial-skin-care')!,
      menuItems.find(item => item.id === 'weight-loss-facial')!,
      menuItems.find(item => item.id === 'basic-metabolism')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'warmup-lulon-experience')!,
      menuItems.find(item => item.id === 'pair-warmup')!
    ],
    explanation: '肌トラブルタイプのあなたには、美肌効果の高いコースが最適です。水素フェイシャルや炭酸パックで肌を整え、内側から美しさを引き出します。',
    benefits: [
      '美肌効果',
      '肌荒れ改善',
      'アンチエイジング',
      '保湿効果'
    ]
  },
  {
    bodyType: 'balanced',
    primaryRecommendations: [
      menuItems.find(item => item.id === 'basic-metabolism')!,
      menuItems.find(item => item.id === 'warmup-lulon-experience')!,
      menuItems.find(item => item.id === 'pair-warmup')!
    ],
    secondaryRecommendations: [
      menuItems.find(item => item.id === 'student-discount-u24')!,
      menuItems.find(item => item.id === 'fertility-support')!
    ],
    explanation: 'バランスタイプのあなたには、全体的な健康維持とリラクゼーションを目的としたコースがおすすめです。予防医学の観点から健康をサポートします。',
    benefits: [
      'バランス調整',
      'リフレッシュ効果',
      'ストレス緩和',
      '全体的な健康維持'
    ]
  }
];

// 診断結果からメニュー推薦を取得する関数
export function getMenuRecommendations(bodyType: string): MenuRecommendation | null {
  return menuRecommendations.find(rec => rec.bodyType === bodyType) || null;
}

// すべてのメニューを取得する関数
export function getAllMenuItems(): MenuItem[] {
  return menuItems;
}

// カテゴリー別にメニューを取得する関数
export function getMenuItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter(item => item.tags.includes(category));
}

// 人気メニューを取得する関数
export function getPopularMenuItems(): MenuItem[] {
  return menuItems.filter(item => item.isPopular);
}

// 新規限定メニューを取得する関数
export function getNewMenuItems(): MenuItem[] {
  return menuItems.filter(item => item.isNew);
}

// 期間限定メニューを取得する関数
export function getLimitedMenuItems(): MenuItem[] {
  return menuItems.filter(item => item.isLimited);
} 