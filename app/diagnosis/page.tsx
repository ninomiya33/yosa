'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMenuRecommendations, type MenuItem } from '../lib/menuRecommendations';

interface Question {
  id: number;
  question: string;
  options: { value: string; label: string; type: string }[];
}

// 症状の深刻度スコアを計算する関数
const getSeverityScore = (answer: string): number => {
  const severityMap: Record<string, number> = {
    // 冷え性関連
    'very_cold': 4, 'cold': 3, 'slightly_cold': 2, 'warm': 1,
    // ストレス関連（重みを下げる）
    'very_high': 3, 'high': 2, 'medium': 1, 'low': 0,
    'severe': 3, 'moderate': 2, 'mild': 1, 'none': 0,
    'chronic': 3, 'often': 2, 'sometimes': 1, 'rarely': 0,
    // むくみ関連
    'very_swollen': 4, 'swollen': 3, 'slightly_swollen': 2, 'not_swollen': 1,
    // ホルモン関連
    'very_irregular': 4, 'irregular': 3, 'slightly_irregular': 2, 'regular': 1,
    // 消化器関連
    'very_poor': 4, 'poor': 3, 'good': 1,
    // 睡眠関連
    'very_bad': 4, 'bad': 3, 'every_night': 4,
    // 肌関連
    'very_dry': 4, 'dry': 3, 'very_oily': 4, 'oily': 3,
    // その他
    'very_high_energy': 4, 'high_energy': 3, 'medium_energy': 2, 'low_energy': 1,
    'very_painful': 4, 'painful': 3, 'slightly_painful': 2, 'not_painful': 1,
    // 追加の回答オプション
    'heavy': 3, 'light': 1, 'overeating': 3, 'mood_swings': 3,
    'summer': 2, 'winter': 2, 'spring': 1, 'bath': 1, 'strong': 2, 'weak': 1,
    'slow': 2, 'fast': 1, 'busy': 2, 'relaxed': 1, 'active': 2, 'inactive': 1
  };
  return severityMap[answer] || 1;
};

// 8つの体質タイプに確実に分類する関数（改善版）
const ensureValidType = (dominantType: string, typeCount: Record<string, number>): string => {
  // 有効な8つの体質タイプ
  const validTypes = ['cold', 'stress', 'swelling', 'hormone', 'digestive', 'sleep', 'skin', 'balanced'];
  
  // 既に有効なタイプの場合はそのまま返す
  if (validTypes.includes(dominantType)) {
    return dominantType;
  }
  
  // 無効なタイプの場合、より適切なマッピング
  const typeMapping: Record<string, string> = {
    'pain': 'cold',           // 痛み → 冷え性
    'dry_skin': 'skin',       // 乾燥肌 → 肌タイプ
    'oily_skin': 'skin',      // 脂性肌 → 肌タイプ
    'energy': 'balanced',     // エネルギー → バランス（ストレスから変更）
    'mood': 'hormone',        // 気分 → ホルモン
    'appetite': 'digestive',  // 食欲 → 消化器
    'fatigue': 'balanced',    // 疲労 → バランス（ストレスから変更）
    'anxiety': 'stress',      // 不安 → ストレス
    'insomnia': 'sleep',      // 不眠 → 睡眠
    'digestion': 'digestive', // 消化 → 消化器
    'circulation': 'cold',    // 血行 → 冷え性
    'water_retention': 'swelling', // 水分貯留 → むくみ
    'inflammation': 'skin',   // 炎症 → 肌
    'tension': 'stress',      // 緊張 → ストレス
    'irritability': 'stress', // イライラ → ストレス
    'depression': 'stress',   // うつ → ストレス
    'headache': 'stress',     // 頭痛 → ストレス
    'back_pain': 'cold',      // 腰痛 → 冷え性
    'stomach_pain': 'digestive', // 腹痛 → 消化器
    'skin_problems': 'skin',  // 肌トラブル → 肌
    'sleep_problems': 'sleep', // 睡眠問題 → 睡眠
    'hormone_problems': 'hormone', // ホルモン問題 → ホルモン
    'digestive_problems': 'digestive', // 消化器問題 → 消化器
    'circulation_problems': 'cold', // 血行問題 → 冷え性
    'water_metabolism': 'swelling', // 水分代謝 → むくみ
    'immune_system': 'balanced', // 免疫 → バランス
    'general_health': 'balanced', // 全般健康 → バランス
    'wellness': 'balanced',   // 健康 → バランス
    'vitality': 'balanced',   // 活力 → バランス
    'balance': 'balanced',    // バランス → バランス
    'overall': 'balanced',    // 全般 → バランス
    'heat': 'balanced'        // 熱 → バランス（新規追加）
  };
  
  // マッピングから適切なタイプを取得
  const mappedType = typeMapping[dominantType];
  if (mappedType) {
    return mappedType;
  }
  
  // デフォルトはバランスタイプ
  return 'balanced';
};

const questions: Question[] = [
  {
    id: 1,
    question: "あなたの体の「温度感覚」について教えてください",
    options: [
      { value: "very_cold", label: "手足が氷のように冷たく、夏でも靴下が必要", type: "cold" },
      { value: "cold", label: "手足が冷たいことが多く、温かい飲み物が手放せない", type: "cold" },
      { value: "normal", label: "普通の体温で、季節に応じて適切に感じる", type: "balanced" },
      { value: "warm", label: "体が温かく、汗をかきやすい体質", type: "heat" }
    ]
  },
  {
    id: 2,
    question: "最近の「疲れの質」はどのような感じですか？",
    options: [
      { value: "very_high", label: "朝から疲れていて、何をするのも億劫", type: "stress" },
      { value: "high", label: "夕方になると疲れがピークになり、家事もままならない", type: "stress" },
      { value: "medium", label: "時々疲れを感じるが、休めば回復する", type: "balanced" },
      { value: "low", label: "疲れを感じることは少なく、元気に過ごしている", type: "balanced" }
    ]
  },
  {
    id: 3,
    question: "「むくみ」で最も気になる部分はどこですか？",
    options: [
      { value: "severe", label: "夕方になると足がパンパンで、靴がきつくなる", type: "swelling" },
      { value: "often", label: "朝起きると顔がむくんでいて、まぶたが重い", type: "swelling" },
      { value: "sometimes", label: "時々むくみを感じるが、すぐに解消される", type: "balanced" },
      { value: "rarely", label: "むくみを感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 4,
    question: "あなたの「肌の悩み」で最も深刻なものは？",
    options: [
      { value: "very_dry", label: "乾燥がひどく、かゆみや粉吹きが気になる", type: "dry_skin" },
      { value: "dry", label: "乾燥しやすく、化粧のりが悪い", type: "dry_skin" },
      { value: "oily", label: "皮脂が多く、ニキビやテカリが気になる", type: "oily_skin" },
      { value: "normal", label: "特に肌の悩みはなく、安定している", type: "balanced" }
    ]
  },
  {
    id: 5,
    question: "「睡眠の質」について、最も当てはまるのは？",
    options: [
      { value: "very_poor", label: "寝つきが悪く、夜中に何度も目が覚めてしまう", type: "sleep" },
      { value: "poor", label: "眠りが浅く、朝起きても疲れが取れない", type: "sleep" },
      { value: "light", label: "時々眠りが浅いが、基本的には眠れる", type: "sleep" },
      { value: "good", label: "よく眠れて、朝すっきり起きられる", type: "balanced" }
    ]
  },
  {
    id: 6,
    question: "「女性特有の体調」で最も気になることは？（該当する方のみ）",
    options: [
      { value: "very_irregular", label: "生理が不規則で、痛みや出血量が多い", type: "hormone" },
      { value: "irregular", label: "生理周期が不安定で、PMSがひどい", type: "hormone" },
      { value: "heavy", label: "生理痛が重く、鎮痛剤が必要", type: "hormone" },
      { value: "normal", label: "生理は比較的規則的で、大きな不調はない", type: "balanced" }
    ]
  },
  {
    id: 7,
    question: "日常的に感じる「体の不調」で最も気になるのは？",
    options: [
      { value: "headache", label: "頭痛や肩こりが慢性化していて、マッサージが欠かせない", type: "stress" },
      { value: "digestive", label: "胃もたれや便秘が続き、お腹の調子が悪い", type: "digestive" },
      { value: "back_pain", label: "腰痛や関節痛があり、体を動かすのが億劫", type: "cold" },
      { value: "none", label: "特に体の不調は感じない", type: "balanced" }
    ]
  },
  {
    id: 8,
    question: "「運動習慣」について、最も当てはまるのは？",
    options: [
      { value: "none", label: "ほとんど運動をしていない", type: "balanced" },
      { value: "light", label: "散歩や軽いストレッチ程度", type: "balanced" },
      { value: "regular", label: "週に2-3回程度、定期的に運動している", type: "balanced" },
      { value: "intense", label: "毎日運動をしているか、激しい運動をしている", type: "balanced" }
    ]
  },
  {
    id: 9,
    question: "「食欲と食事」について、最も当てはまるのは？",
    options: [
      { value: "poor_appetite", label: "食欲がなく、食べてもすぐ満腹になる", type: "digestive" },
      { value: "overeating", label: "食欲が旺盛で、つい食べ過ぎてしまう", type: "digestive" },
      { value: "irregular", label: "食事時間が不規則で、朝食を抜くことが多い", type: "digestive" },
      { value: "normal", label: "普通の食欲で、規則正しく食べている", type: "balanced" }
    ]
  },
  {
    id: 10,
    question: "「心の状態」について、最も当てはまるのは？",
    options: [
      { value: "anxiety", label: "不安やイライラを感じることが多く、心が落ち着かない", type: "stress" },
      { value: "depression", label: "気分が落ち込みやすく、やる気が出ない", type: "stress" },
      { value: "mood_swings", label: "気分の変動が激しく、感情のコントロールが難しい", type: "hormone" },
      { value: "stable", label: "精神的に安定していて、前向きに過ごしている", type: "balanced" }
    ]
  },
  {
    id: 11,
    question: "「季節の変化」で最も体調を崩しやすいのは？",
    options: [
      { value: "spring", label: "春の花粉症やアレルギー症状がひどい", type: "allergy" },
      { value: "summer", label: "夏の暑さで体調を崩しやすい", type: "heat" },
      { value: "autumn", label: "秋の気温差で風邪をひきやすい", type: "cold" },
      { value: "winter", label: "冬の寒さで体が冷えて不調になる", type: "cold" }
    ]
  },
  {
    id: 12,
    question: "「ストレス解消法」として、最も効果を感じるのは？",
    options: [
      { value: "bath", label: "お風呂に入ってリラックスする", type: "relaxation" },
      { value: "exercise", label: "運動して体を動かす", type: "active" },
      { value: "sleep", label: "十分な睡眠を取る", type: "sleep" },
      { value: "hobby", label: "趣味に没頭する", type: "balanced" }
    ]
  },
  {
    id: 13,
    question: "「肩こり・首こり」の程度はどのくらいですか？",
    options: [
      { value: "severe", label: "常に肩が重く、マッサージが欠かせない", type: "cold" },
      { value: "often", label: "よく肩こりを感じ、疲れるとひどくなる", type: "stress" },
      { value: "sometimes", label: "時々肩こりを感じるが、すぐに解消される", type: "balanced" },
      { value: "rarely", label: "肩こりを感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 14,
    question: "「便秘」の頻度はどのくらいですか？",
    options: [
      { value: "chronic", label: "慢性的に便秘で、薬に頼ることが多い", type: "digestive" },
      { value: "often", label: "よく便秘になり、お腹の張りが気になる", type: "digestive" },
      { value: "sometimes", label: "時々便秘になるが、自然に解消される", type: "balanced" },
      { value: "rarely", label: "便秘を感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 15,
    question: "「生理痛」の程度はどのくらいですか？（該当する方のみ）",
    options: [
      { value: "severe", label: "鎮痛剤が必要で、動けないほど痛い", type: "hormone" },
      { value: "moderate", label: "痛みがあり、体を休めたい", type: "hormone" },
      { value: "mild", label: "軽い痛みがあるが、日常生活に支障はない", type: "balanced" },
      { value: "none", label: "生理痛はほとんど感じない", type: "balanced" }
    ]
  },
  {
    id: 16,
    question: "「PMS（月経前症候群）」の症状はありますか？（該当する方のみ）",
    options: [
      { value: "severe", label: "イライラ、むくみ、頭痛など症状が重い", type: "hormone" },
      { value: "moderate", label: "気分の変動や体調の変化を感じる", type: "hormone" },
      { value: "mild", label: "軽い症状があるが、気にならない程度", type: "balanced" },
      { value: "none", label: "PMSの症状は感じない", type: "balanced" }
    ]
  },
  {
    id: 17,
    question: "「頭痛」の頻度はどのくらいですか？",
    options: [
      { value: "chronic", label: "慢性的な頭痛があり、薬が手放せない", type: "stress" },
      { value: "often", label: "よく頭痛になり、ストレスで悪化する", type: "stress" },
      { value: "sometimes", label: "時々頭痛を感じるが、すぐに治る", type: "balanced" },
      { value: "rarely", label: "頭痛を感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 18,
    question: "「腰痛」の程度はどのくらいですか？",
    options: [
      { value: "severe", label: "常に腰痛があり、動くのがつらい", type: "pain" },
      { value: "often", label: "よく腰痛になり、長時間座ると悪化する", type: "cold" },
      { value: "sometimes", label: "時々腰痛を感じるが、休めば治る", type: "balanced" },
      { value: "rarely", label: "腰痛を感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 19,
    question: "「食欲」について、最も当てはまるのは？",
    options: [
      { value: "very_poor", label: "食欲がなく、食べてもすぐ満腹になる", type: "digestive" },
      { value: "poor", label: "食欲が少なく、少量でも満足する", type: "stress" },
      { value: "normal", label: "普通の食欲で、おいしく食べられる", type: "balanced" },
      { value: "strong", label: "食欲が旺盛で、つい食べ過ぎてしまう", type: "digestive" }
    ]
  },
  {
    id: 20,
    question: "「胃もたれ・胃痛」の頻度はどのくらいですか？",
    options: [
      { value: "chronic", label: "慢性的に胃の調子が悪く、薬を常用している", type: "digestive" },
      { value: "often", label: "よく胃もたれを感じ、ストレスで悪化する", type: "stress" },
      { value: "sometimes", label: "時々胃もたれを感じるが、すぐに治る", type: "balanced" },
      { value: "rarely", label: "胃の不調を感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 21,
    question: "「肌の乾燥」の程度はどのくらいですか？",
    options: [
      { value: "severe", label: "とても乾燥していて、かゆみや粉吹きがある", type: "dry_skin" },
      { value: "moderate", label: "乾燥しやすく、化粧のりが悪い", type: "dry_skin" },
      { value: "mild", label: "時々乾燥を感じるが、保湿で改善する", type: "balanced" },
      { value: "none", label: "肌の乾燥を感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 22,
    question: "「ニキビ・肌荒れ」の頻度はどのくらいですか？",
    options: [
      { value: "chronic", label: "慢性的にニキビができ、肌荒れが続いている", type: "oily_skin" },
      { value: "often", label: "よくニキビができ、生理前やストレスで悪化する", type: "hormone" },
      { value: "sometimes", label: "時々ニキビができるが、すぐに治る", type: "balanced" },
      { value: "rarely", label: "ニキビや肌荒れを感じることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 23,
    question: "「夜中に目が覚める」頻度はどのくらいですか？",
    options: [
      { value: "every_night", label: "毎晩目が覚めて、再び眠るのが難しい", type: "sleep" },
      { value: "often", label: "よく夜中に目が覚める", type: "sleep" },
      { value: "sometimes", label: "時々夜中に目が覚めるが、すぐに眠れる", type: "balanced" },
      { value: "rarely", label: "夜中に目が覚めることはほとんどない", type: "balanced" }
    ]
  },
  {
    id: 24,
    question: "「寝つきの悪さ」について、最も当てはまるのは？",
    options: [
      { value: "very_bad", label: "寝つきがとても悪く、1時間以上かかる", type: "sleep" },
      { value: "bad", label: "寝つきが悪く、30分以上かかることが多い", type: "sleep" },
      { value: "sometimes", label: "時々寝つきが悪いが、基本的には眠れる", type: "balanced" },
      { value: "good", label: "寝つきは良く、すぐに眠れる", type: "balanced" }
    ]
  },
  {
    id: 25,
    question: "「気分の変動」について、最も当てはまるのは？",
    options: [
      { value: "severe", label: "気分の変動が激しく、感情のコントロールが難しい", type: "hormone" },
      { value: "moderate", label: "時々気分が変わりやすく、イライラすることがある", type: "stress" },
      { value: "mild", label: "軽い気分の変動はあるが、コントロールできる", type: "balanced" },
      { value: "stable", label: "気分は安定していて、大きな変動はない", type: "balanced" }
    ]
  },
  {
    id: 26,
    question: "「集中力」について、最も当てはまるのは？",
    options: [
      { value: "very_poor", label: "集中力がなく、何をしても続かない", type: "stress" },
      { value: "poor", label: "集中力が低く、すぐに気が散る", type: "sleep" },
      { value: "normal", label: "普通の集中力で、必要な時は集中できる", type: "balanced" },
      { value: "good", label: "集中力があり、長時間作業できる", type: "balanced" }
    ]
  },
  {
    id: 27,
    question: "「免疫力」について、最も当てはまるのは？",
    options: [
      { value: "very_weak", label: "風邪をひきやすく、体調を崩しやすい", type: "cold" },
      { value: "weak", label: "疲れると体調を崩しやすい", type: "stress" },
      { value: "normal", label: "普通の免疫力で、大きな病気はしない", type: "balanced" },
      { value: "strong", label: "免疫力が強く、体調を崩すことは少ない", type: "balanced" }
    ]
  },
  {
    id: 28,
    question: "「体重の変動」について、最も当てはまるのは？",
    options: [
      { value: "large", label: "体重の変動が大きく、1-2kgの増減がある", type: "swelling" },
      { value: "moderate", label: "時々体重が変動する", type: "digestive" },
      { value: "small", label: "体重の変動は少ない", type: "balanced" },
      { value: "stable", label: "体重は安定していて、大きな変動はない", type: "balanced" }
    ]
  },
  {
    id: 29,
    question: "「疲れの回復」について、最も当てはまるのは？",
    options: [
      { value: "very_slow", label: "疲れが取れにくく、何日も続く", type: "stress" },
      { value: "slow", label: "疲れの回復が遅く、休んでもなかなか取れない", type: "sleep" },
      { value: "normal", label: "普通の疲れで、休めば回復する", type: "balanced" },
      { value: "fast", label: "疲れの回復が早く、すぐに元気になる", type: "balanced" }
    ]
  },
  {
    id: 30,
    question: "「生活習慣」について、最も当てはまるのは？",
    options: [
      { value: "irregular", label: "生活が不規則で、食事や睡眠時間がバラバラ", type: "digestive" },
      { value: "busy", label: "忙しくて、自分の時間が取れない", type: "stress" },
      { value: "normal", label: "普通の生活で、適度にリラックスタイムがある", type: "balanced" },
      { value: "healthy", label: "健康的な生活を心がけている", type: "balanced" }
    ]
  }
];

// 8つの体質タイプの定義
const bodyTypes = {
  cold: {
    name: "冷え性タイプ",
    description: "体の芯から冷えやすく、血行不良による様々な不調を感じやすいタイプです。冷えは万病の元と言われ、多くの症状の原因となっています。",
    symptoms: ["手足の冷え", "肩こり・首こり", "むくみ", "疲れやすさ", "生理痛", "腰痛", "便秘", "肌荒れ"],
    recommendation: "温活ブレンド",
    recommendationDesc: "生姜、シナモン、よもぎを配合した温活ブレンドで、体の芯から温めて血行促進をサポートします。冷えによる不調を根本から改善します。",
    color: "blue",
    dailyTips: [
      "毎日10分の足湯で血行促進（40度のお湯で）",
      "生姜紅茶を習慣にして体を内側から温める",
      "腹巻きやレッグウォーマーで保温を徹底",
      "軽いストレッチで体を温める（特に下半身）",
      "温かい食事を心がけ、冷たい飲み物を避ける"
    ],
    positiveMessage: "冷えは改善可能です！多くの女性が冷えに悩んでいますが、体を温める習慣で、あなたの体は必ず変わります。よもぎ蒸しで芯から温まって、新しい自分に出会いましょう。"
  },
  stress: {
    name: "ストレス・疲労タイプ",
    description: "日常的にストレスや疲れを感じやすく、心身の緊張が続いているタイプです。現代社会では多くの人がこのタイプに当てはまり、心身のバランスを崩しやすい状態です。",
    symptoms: ["慢性疲労", "イライラ・不安感", "睡眠不足", "頭痛・肩こり", "胃痛", "食欲不振", "集中力低下", "免疫力低下"],
    recommendation: "リラックスブレンド",
    recommendationDesc: "ラベンダー、カモミール、よもぎを配合したリラックスブレンドで、心身の緊張を解きほぐし深いリラクゼーションを促します。ストレスによる不調を根本から改善します。",
    color: "purple",
    dailyTips: [
      "深呼吸を1日3回、5分ずつ行う（腹式呼吸で）",
      "アロマオイルでリラックスタイム（ラベンダーがおすすめ）",
      "軽い散歩で気分転換（自然の中を歩く）",
      "スマホの使用時間を制限（就寝1時間前から）",
      "温かいお風呂でリラックス（38-40度で20分）"
    ],
    positiveMessage: "ストレスは現代病ですが、あなたはもう対処法を知っています。多くの人が同じ悩みを抱えていますが、よもぎ蒸しで心身を癒して、本来の輝きを取り戻しましょう。"
  },
  swelling: {
    name: "むくみ・水分代謝タイプ",
    description: "水分代謝が滞りがちで、体内の余分な水分が蓄積しやすいタイプです。むくみは体からのSOSサインで、代謝機能の低下を示しています。",
    symptoms: ["足のむくみ", "顔のむくみ", "だるさ・重い感じ", "体重の変動", "冷え", "便秘", "肌のくすみ", "疲れやすさ"],
    recommendation: "デトックスブレンド",
    recommendationDesc: "ハトムギ、どくだみ、よもぎを配合したデトックスブレンドで、余分な水分を排出し体内をクレンジングします。代謝機能を改善してむくみを根本から解決します。",
    color: "cyan",
    dailyTips: [
      "1日1.5Lの水をこまめに飲む（朝起きてコップ1杯から）",
      "塩分を控えた食事を心がける（1日6g以下）",
      "足を高くして寝る（15-20cm程度）",
      "軽いマッサージでリンパ流し（下から上へ）",
      "カリウム豊富な食材を摂る（バナナ、アボカドなど）"
    ],
    positiveMessage: "むくみは体からのSOSサイン。多くの女性がむくみに悩んでいますが、よもぎ蒸しでデトックスして、軽やかな体を手に入れましょう。あなたの体はもっと軽くなるはずです。"
  },
  hormone: {
    name: "ホルモンバランスタイプ",
    description: "女性ホルモンのバランスが乱れやすく、周期的な不調を感じやすいタイプです。女性の体は月のリズムと共に変化し、ホルモンの影響を大きく受けます。",
    symptoms: ["生理不順・PMS", "肌荒れ・ニキビ", "情緒不安定", "更年期症状", "疲れやすさ", "むくみ", "頭痛", "腰痛"],
    recommendation: "女性ケアブレンド",
    recommendationDesc: "ローズ、チェストベリー、よもぎを配合した女性ケアブレンドで、女性ホルモンを整え女性特有の不調をケアします。女性らしい美しさを取り戻します。",
    color: "pink",
    dailyTips: [
      "大豆製品を積極的に摂る（納豆、豆腐、豆乳など）",
      "規則正しい生活リズムを保つ（睡眠時間を固定）",
      "ビタミンE豊富な食材を摂る（アーモンド、アボカドなど）",
      "適度な運動でホルモン分泌促進（ウォーキングがおすすめ）",
      "ストレスを溜めない生活を心がける（リラックスタイムを確保）"
    ],
    positiveMessage: "女性の体は月のリズムと共に変化します。多くの女性がホルモンバランスの乱れに悩んでいますが、よもぎ蒸しで女性ホルモンを整えて、美しく輝く女性らしさを取り戻しましょう。"
  },
  digestive: {
    name: "消化器系タイプ",
    description: "胃腸の働きが弱く、消化器系の不調を感じやすいタイプです。腸は第二の脳と言われ、全身の健康に大きく影響します。",
    symptoms: ["便秘・下痢", "胃もたれ・胃痛", "食欲不振・過食", "お腹の張り", "消化不良", "肌荒れ", "疲れやすさ", "免疫力低下"],
    recommendation: "胃腸ケアブレンド",
    recommendationDesc: "カモミール、ペパーミント、よもぎを配合した胃腸ケアブレンドで、消化器系の働きを改善し胃腸を整えます。腸内環境を改善して全身の健康をサポートします。",
    color: "yellow",
    dailyTips: [
      "よく噛んでゆっくり食べる（一口30回以上）",
      "食物繊維豊富な食材を摂る（野菜、果物、玄米など）",
      "朝起きてコップ1杯の水を飲む（常温で）",
      "適度な運動で腸の動きを促進（ウォーキングが効果的）",
      "ストレスを避けた食事時間を心がける（リラックスして食べる）"
    ],
    positiveMessage: "腸は第二の脳と言われます。多くの人が胃腸の不調に悩んでいますが、よもぎ蒸しで胃腸を整えて、体の中から健康になりましょう。あなたの体は必ず応えてくれます。"
  },
  sleep: {
    name: "睡眠障害タイプ",
    description: "睡眠の質が悪く、心身の回復が十分でないタイプです。質の良い睡眠は最高の美容液と言われ、健康の基盤となります。",
    symptoms: ["寝つきの悪さ", "夜中覚醒", "眠りが浅い", "日中の眠気", "疲労感", "集中力低下", "イライラ", "肌荒れ"],
    recommendation: "安眠ブレンド",
    recommendationDesc: "パッションフラワー、バレリアン、よもぎを配合した安眠ブレンドで、質の良い睡眠をサポートし心身の回復を促します。深い眠りで体を癒します。",
    color: "indigo",
    dailyTips: [
      "就寝1時間前はスマホを見ない（ブルーライトを避ける）",
      "温かいハーブティーでリラックス（カモミールがおすすめ）",
      "寝室を暗く静かに保つ（遮光カーテンを使用）",
      "毎日同じ時間に寝る習慣をつける（体内時計を整える）",
      "軽いストレッチで体をリラックス（就寝30分前）"
    ],
    positiveMessage: "質の良い睡眠は最高の美容液です。多くの人が睡眠の質に悩んでいますが、よもぎ蒸しで深い眠りを手に入れて、朝目覚めた時の爽快感を体験しましょう。"
  },
  skin: {
    name: "肌トラブルタイプ",
    description: "肌の状態が不安定で、様々な肌トラブルを抱えやすいタイプです。美しい肌は健康の証で、内側からのケアが重要です。",
    symptoms: ["乾燥肌・敏感肌", "ニキビ・肌荒れ", "かゆみ・赤み", "くすみ・シミ", "毛穴の開き", "肌のたるみ", "アレルギー", "肌の疲れ"],
    recommendation: "美肌ブレンド",
    recommendationDesc: "カレンデュラ、アロエベラ、よもぎを配合した美肌ブレンドで、肌を整え内側から輝く美しさをサポートします。肌のターンオーバーを促進します。",
    color: "green",
    dailyTips: [
      "十分な水分補給を心がける（1日1.5L以上）",
      "ビタミンC豊富な食材を摂る（柑橘類、ブロッコリーなど）",
      "肌に優しいスキンケア用品を使用（低刺激のものを選ぶ）",
      "十分な睡眠で肌の修復を促進（7-8時間の睡眠）",
      "ストレスを避けて肌の状態を安定（リラックスタイムを確保）"
    ],
    positiveMessage: "美しい肌は健康の証です。多くの女性が肌トラブルに悩んでいますが、よもぎ蒸しで肌を整えて、内側から輝く美しさを手に入れましょう。あなたの肌はもっと美しくなります。"
  },
  balanced: {
    name: "バランスタイプ",
    description: "全体的に健康的で、予防やリラクゼーションが中心のタイプです。予防は最高の治療と言われ、健康維持の意識が高い方です。",
    symptoms: ["健康維持", "美容効果", "リラクゼーション", "予防ケア", "体調管理", "免疫力向上", "アンチエイジング", "心身のバランス"],
    recommendation: "バランスブレンド",
    recommendationDesc: "よもぎ、ローズヒップ、レモングラスを配合したバランスブレンドで、美容と健康維持を総合的にサポートします。予防医学の観点から健康をサポートします。",
    color: "emerald",
    dailyTips: [
      "バランスの取れた食事を心がける（和食中心の食事）",
      "適度な運動習慣を継続（週3回30分のウォーキング）",
      "十分な睡眠で体を休める（7-8時間の質の良い睡眠）",
      "ストレス管理を意識した生活（マインドフルネスを取り入れる）",
      "定期的なリラックスタイムを設ける（週末は自分時間を確保）"
    ],
    positiveMessage: "あなたは既に健康のバランスを保つ力を持っています。多くの人が健康維持に悩んでいますが、よもぎ蒸しでさらに美しく、より輝く自分になりましょう。予防は最高の治療です。"
  }
};

// タイプごとの画像パス
const typeImageMap: Record<string, string> = {
  stress: '/images/types/stress.png',
  hormone: '/images/types/hormone.png',
  swelling: '/images/types/swelling.png',
  cold: '/images/types/cold.png',
  skin: '/images/types/skin.png',
  digestive: '/images/types/digestive.png',
  sleep: '/images/types/sleep.png',
  balanced: '/images/types/balanced.png',
};

// 30個の質問タイトルを定義
const QUESTION_TITLES = [
  "あなたの手足の冷えの程度は？",
  "体の疲れやすさについて、最も当てはまるのは？",
  "むくみの程度はどのくらいですか？",
  "ストレスを感じる頻度はどのくらいですか？",
  "睡眠の質について、最も当てはまるのは？",
  "食欲について、最も当てはまるのは？",
  "肌の状態について、最も当てはまるのは？",
  "生理周期の規則性は？",
  "頭痛の頻度はどのくらいですか？",
  "腰痛の程度はどのくらいですか？",
  "胃もたれ・胃痛の頻度はどのくらいですか？",
  "便秘の頻度はどのくらいですか？",
  "下痢の頻度はどのくらいですか？",
  "肩こりの程度はどのくらいですか？",
  "めまいの頻度はどのくらいですか？",
  "動悸の頻度はどのくらいですか？",
  "息切れの頻度はどのくらいですか？",
  "生理痛の程度はどのくらいですか？",
  "PMS（月経前症候群）の症状はありますか？",
  "頭痛の頻度はどのくらいですか？",
  "腰痛の程度はどのくらいですか？",
  "食欲について、最も当てはまるのは？",
  "胃もたれ・胃痛の頻度はどのくらいですか？",
  "肌の乾燥の程度はどのくらいですか？",
  "ニキビ・肌荒れの頻度はどのくらいですか？",
  "夜中に目が覚める頻度はどのくらいですか？",
  "寝つきの悪さについて、最も当てはまるのは？",
  "気分の変動について、最も当てはまるのは？",
  "イライラの頻度はどのくらいですか？",
  "不安感の程度はどのくらいですか？",
  "集中力の低下について、最も当てはまるのは？"
];

export default function DiagnosisPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [savedDiagnosis, setSavedDiagnosis] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // 回答を選択したら自動的に次の質問に進む（最後の質問の場合は結果を計算）
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResult();
      }
    }, 500); // 少し長めの遅延でユーザーが選択を確認できるように
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = async () => {
    const typeCount: Record<string, number> = {}
    const typeScores: Record<string, number> = {}
    const questionAnswers: Record<string, any> = {}
    
    // 各タイプのスコアを計算し、質問と回答を記録
    questions.forEach((q, index) => {
      const answer = answers[q.id];
      if (answer) {
        const option = q.options.find(opt => opt.value === answer);
        if (option) {
          // 基本スコア
          typeCount[option.type] = (typeCount[option.type] || 0) + 1;
          
          // 重み付きスコア（症状の深刻度に応じて）
          const severityScore = getSeverityScore(answer);
          typeScores[option.type] = (typeScores[option.type] || 0) + severityScore;
          
          // 質問タイトルと回答を記録（30個の質問タイトルに対応）
          const questionTitle = QUESTION_TITLES[index] || `質問${q.id}`;
          questionAnswers[questionTitle] = {
            questionId: q.id,
            answer: answer,
            label: option.label,
            type: option.type,
            severityScore: severityScore
          };
        }
      }
    });

    // よりバランスの取れた結果判定ロジック
    let finalType = 'balanced';
    
    // スコアが高いタイプを上位3つ取得
    const topTypes = Object.entries(typeScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    if (topTypes.length > 0) {
      const [topType, topScore] = topTypes[0];
      const [secondType, secondScore] = topTypes[1] || ['', 0];
      
      // 1位と2位のスコア差が小さい場合は、より多様な結果を出す
      if (topScore - secondScore <= 2) {
        // スコア差が小さい場合は、ランダム性を加える
        const randomFactor = Math.random();
        if (randomFactor < 0.4) {
          finalType = ensureValidType(topType, typeCount);
        } else if (randomFactor < 0.7 && secondType) {
          finalType = ensureValidType(secondType, typeCount);
        } else {
          // バランスタイプの確率を上げる
          finalType = 'balanced';
        }
      } else {
        // スコア差が大きい場合は、1位のタイプを採用
        finalType = ensureValidType(topType, typeCount);
      }
    }

    setResult(finalType);

    // 診断結果をSupabaseに保存
    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bodyTypeKey: finalType,
          answers: questionAnswers, // 質問タイトル → 回答の形式で保存
          rawAnswers: answers, // 元の回答データも保存
          typeScores: typeScores, // 各タイプのスコアも保存
          typeCount: typeCount, // 各タイプの回答数も保存
          questionTitles: QUESTION_TITLES, // 質問タイトル配列も保存
          userId: null // ログイン機能実装時に更新
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSavedDiagnosis(result.diagnosis);
        console.log('診断結果が保存されました');
      } else {
        console.error('診断結果の保存に失敗しました');
      }
    } catch (error) {
      console.error('診断結果保存エラー:', error);
    }
  };

  const getResultContent = (type: string) => {
    return bodyTypes[type as keyof typeof bodyTypes] || bodyTypes.balanced;
  };

  const getTypeBackground = (key: string) => {
    const backgroundMap = {
      cold: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      stress: 'bg-gradient-to-r from-purple-50 to-indigo-50',
      swelling: 'bg-gradient-to-r from-cyan-50 to-blue-50',
      hormone: 'bg-gradient-to-r from-pink-50 to-rose-50',
      digestive: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      sleep: 'bg-gradient-to-r from-indigo-50 to-purple-50',
      skin: 'bg-gradient-to-r from-green-50 to-emerald-50',
      balanced: 'bg-gradient-to-r from-emerald-50 to-teal-50'
    };
    return backgroundMap[key as keyof typeof backgroundMap] || backgroundMap.balanced;
  };

  const getTypeIconBackground = (key: string) => {
    const iconBackgroundMap = {
      cold: 'bg-gradient-to-br from-blue-400 to-blue-600',
      stress: 'bg-gradient-to-br from-purple-400 to-purple-600',
      swelling: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
      hormone: 'bg-gradient-to-br from-pink-400 to-pink-600',
      digestive: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      sleep: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      skin: 'bg-gradient-to-br from-green-400 to-green-600',
      balanced: 'bg-gradient-to-br from-emerald-400 to-emerald-600'
    };
    return iconBackgroundMap[key as keyof typeof iconBackgroundMap] || iconBackgroundMap.balanced;
  };

  const getTypeColor = (key: string) => {
    const colorMap = {
      cold: 'bg-blue-500',
      stress: 'bg-purple-500',
      swelling: 'bg-cyan-500',
      hormone: 'bg-pink-500',
      digestive: 'bg-yellow-500',
      sleep: 'bg-indigo-500',
      skin: 'bg-green-500',
      balanced: 'bg-emerald-500'
    };
    return colorMap[key as keyof typeof colorMap] || colorMap.balanced;
  };

  const getTypeTextColor = (key: string) => {
    const textColorMap = {
      cold: 'text-blue-700',
      stress: 'text-purple-700',
      swelling: 'text-cyan-700',
      hormone: 'text-pink-700',
      digestive: 'text-yellow-700',
      sleep: 'text-indigo-700',
      skin: 'text-green-700',
      balanced: 'text-emerald-700'
    };
    return textColorMap[key as keyof typeof textColorMap] || textColorMap.balanced;
  };

  const getTypeTagBackground = (key: string) => {
    const tagBackgroundMap = {
      cold: 'bg-blue-100',
      stress: 'bg-purple-100',
      swelling: 'bg-cyan-100',
      hormone: 'bg-pink-100',
      digestive: 'bg-yellow-100',
      sleep: 'bg-indigo-100',
      skin: 'bg-green-100',
      balanced: 'bg-emerald-100'
    };
    return tagBackgroundMap[key as keyof typeof tagBackgroundMap] || tagBackgroundMap.balanced;
  };

  const getTypeTagTextColor = (key: string) => {
    const tagTextColorMap = {
      cold: 'text-blue-700',
      stress: 'text-purple-700',
      swelling: 'text-cyan-700',
      hormone: 'text-pink-700',
      digestive: 'text-yellow-700',
      sleep: 'text-indigo-700',
      skin: 'text-green-700',
      balanced: 'text-emerald-700'
    };
    return tagTextColorMap[key as keyof typeof tagTextColorMap] || tagTextColorMap.balanced;
  };

  // 可愛いキャラクター要素の関数
  const getTypeEmoji = (key: string) => {
    const emojiMap = {
      cold: '❄️',
      stress: '😰',
      swelling: '💧',
      hormone: '🌸',
      digestive: '🍃',
      sleep: '😴',
      skin: '✨',
      balanced: '💚'
    };
    return emojiMap[key as keyof typeof emojiMap] || '💫';
  };

  const getTypeGradient = (key: string) => {
    const gradientMap = {
      cold: 'bg-gradient-to-br from-blue-200 to-blue-300',
      stress: 'bg-gradient-to-br from-purple-200 to-purple-300',
      swelling: 'bg-gradient-to-br from-cyan-200 to-cyan-300',
      hormone: 'bg-gradient-to-br from-pink-200 to-pink-300',
      digestive: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
      sleep: 'bg-gradient-to-br from-indigo-200 to-indigo-300',
      skin: 'bg-gradient-to-br from-rose-200 to-rose-300',
      balanced: 'bg-gradient-to-br from-green-200 to-green-300'
    };
    return gradientMap[key as keyof typeof gradientMap] || 'bg-gradient-to-br from-gray-200 to-gray-300';
  };

  const getTypeIcon = (key: string) => {
    const iconMap = {
      cold: '🧊',
      stress: '😤',
      swelling: '💦',
      hormone: '🌺',
      digestive: '🌿',
      sleep: '🌙',
      skin: '💎',
      balanced: '🍀'
    };
    return iconMap[key as keyof typeof iconMap] || '⭐';
  };

  const getTypeDecoration = (key: string) => {
    const decorationMap = {
      cold: '❄️',
      stress: '💜',
      swelling: '💙',
      hormone: '💖',
      digestive: '💛',
      sleep: '💙',
      skin: '💗',
      balanced: '💚'
    };
    return decorationMap[key as keyof typeof decorationMap] || '💫';
  };

  let diagnosisResultSection = null;
  if (result) {
    const content = getResultContent(result);
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      pink: 'text-pink-600 bg-pink-50 border-pink-200',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    };
    diagnosisResultSection = (
      <div key="diagnosis-result" className="mb-12 md:mb-16">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-green-600 text-xl md:text-2xl w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"></i>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">診断結果</h1>
          <p className="text-base md:text-lg text-gray-600">あなたの体質タイプが分かりました</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6 md:mb-8">
          <div className="text-center mb-6 md:mb-8">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              content.color === 'blue' ? 'bg-blue-100' :
              content.color === 'purple' ? 'bg-purple-100' :
              content.color === 'cyan' ? 'bg-cyan-100' :
              content.color === 'pink' ? 'bg-pink-100' :
              content.color === 'yellow' ? 'bg-yellow-100' :
              content.color === 'indigo' ? 'bg-indigo-100' :
              content.color === 'green' ? 'bg-green-100' :
              'bg-emerald-100'
            }`}>
              <i className={`text-2xl md:text-3xl ${
                content.color === 'blue' ? 'text-blue-600' :
                content.color === 'purple' ? 'text-purple-600' :
                content.color === 'cyan' ? 'text-cyan-600' :
                content.color === 'pink' ? 'text-pink-600' :
                content.color === 'yellow' ? 'text-yellow-600' :
                content.color === 'indigo' ? 'text-indigo-600' :
                content.color === 'green' ? 'text-green-600' :
                'text-emerald-600'
              }`}>
                {result === 'cold' ? '❄️' :
                 result === 'stress' ? '😰' :
                 result === 'swelling' ? '💧' :
                 result === 'hormone' ? '🌸' :
                 result === 'digestive' ? '🍃' :
                 result === 'sleep' ? '😴' :
                 result === 'skin' ? '✨' :
                 '🌿'}
              </i>
            </div>
            <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-4 ${colorClasses[content.color as keyof typeof colorClasses]}`}>
              {content.name}
            </h2>
            <p className="text-base md:text-lg text-gray-600">{content.description}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">あなたの体質の特徴</h3>
                <ul className="space-y-2 mb-6">
                  {content.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-center text-gray-600 text-sm md:text-base">
                    <i className="ri-checkbox-circle-fill text-pink-500 mr-2 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"></i>
                      {symptom}
                    </li>
                  ))}
                </ul>
                
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 md:p-6 mb-6 border-l-4 border-pink-400">
                  <h4 className="text-base md:text-lg font-semibold mb-2 text-pink-800">改善のポイント</h4>
                  <p className="text-gray-700 text-sm md:text-base mb-3">
                    この体質タイプは、多くの女性が経験する一般的な不調です。よもぎ蒸しで根本的な改善を目指しましょう。
                  </p>
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <h5 className="font-semibold text-sm text-pink-800 mb-1">診断分析結果</h5>
                    <p className="text-xs text-gray-600">
                      • 30問の詳細診断により、あなたの体質を精密に分析しました<br/>
                      • 症状の深刻度と頻度を総合的に評価<br/>
                      • 8つの体質タイプから最適なタイプを特定
                    </p>
                  </div>
                </div>
                
              <div className={`p-4 md:p-6 rounded-lg border ${colorClasses[content.color as keyof typeof colorClasses]}`}>
                <h4 className="text-base md:text-lg font-semibold mb-2">おすすめブレンド</h4>
                <p className="text-lg md:text-xl font-bold mb-2">{content.recommendation}</p>
                <p className="text-gray-700 text-sm md:text-base">{content.recommendationDesc}</p>
              </div>
            </div>
              <div>
              <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-6 md:p-8 h-48 md:h-64 flex flex-col justify-center items-center border-2 border-dashed border-green-200">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 ${
                  content.color === 'blue' ? 'bg-blue-100' :
                  content.color === 'purple' ? 'bg-purple-100' :
                  content.color === 'cyan' ? 'bg-cyan-100' :
                  content.color === 'pink' ? 'bg-pink-100' :
                  content.color === 'yellow' ? 'bg-yellow-100' :
                  content.color === 'indigo' ? 'bg-indigo-100' :
                  content.color === 'green' ? 'bg-green-100' :
                  'bg-emerald-100'
                }`}>
                  <i className={`text-2xl md:text-3xl ${
                    content.color === 'blue' ? 'text-blue-600' :
                    content.color === 'purple' ? 'text-purple-600' :
                    content.color === 'cyan' ? 'text-cyan-600' :
                    content.color === 'pink' ? 'text-pink-600' :
                    content.color === 'yellow' ? 'text-yellow-600' :
                    content.color === 'indigo' ? 'text-indigo-600' :
                    content.color === 'green' ? 'text-green-600' :
                    'text-emerald-600'
                  }`}>
                    {result === 'cold' ? '❄️' :
                     result === 'stress' ? '😰' :
                     result === 'swelling' ? '💧' :
                     result === 'hormone' ? '🌸' :
                     result === 'digestive' ? '🍃' :
                     result === 'sleep' ? '😴' :
                     result === 'skin' ? '✨' :
                     '🌿'}
                  </i>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2 text-center">
                  {content.recommendation}
                </h4>
                <p className="text-gray-600 text-sm md:text-base text-center">
                  あなたに最適なブレンド
                </p>
              </div>
            </div>
          </div>
          {/* 日常でできる解決方法 */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">日常でできる解決方法</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {content.dailyTips.map((tip, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 md:p-6 border-l-4 border-pink-300">
                  <div className="flex items-start">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-pink-600 font-bold text-xs md:text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* ポジティブメッセージ */}
          <div className={`p-6 md:p-8 rounded-xl text-center ${colorClasses[content.color as keyof typeof colorClasses]} bg-opacity-10`}>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="ri-heart-line text-pink-500 text-xl md:text-2xl"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">あなたへのメッセージ</h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">
              "{content.positiveMessage}"
            </p>
          </div>
        </div>
        {/* 詳細表示ボタン */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-4"
          >
            {showDetails ? '詳細を隠す' : '診断詳細を見る'}
          </button>
        </div>

                    {/* 診断詳細 */}
            {showDetails && savedDiagnosis && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">診断詳細</h3>
                
                {/* 診断情報 */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <i className="ri-information-line text-blue-500 mr-2"></i>
                    <span className="text-sm text-blue-700 font-medium">診断情報</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">体質タイプ:</span>
                      <span className="ml-2 font-medium text-gray-800">
                        {bodyTypes[savedDiagnosis.body_types?.key as keyof typeof bodyTypes]?.name || '不明'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">診断日時:</span>
                      <span className="ml-2 font-medium text-gray-800">
                        {new Date(savedDiagnosis.created_at).toLocaleString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </div>
            
            {/* 各タイプのスコア */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">各体質タイプのスコア：</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(savedDiagnosis.answers.typeScores || {}).map(([type, score]) => (
                  <div key={type} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-600">
                      {bodyTypes[type as keyof typeof bodyTypes]?.name || type}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {score as number}点
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 質問と回答の詳細 */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">質問と回答（30問）：</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(() => {
                  // 保存されたデータから質問と回答を取得
                  const questionAnswers = savedDiagnosis.answers.questionAnswers || {};
                  const rawAnswers = savedDiagnosis.answers.rawAnswers || {};
                  const questionTitles = savedDiagnosis.answers.questionTitles || [];
                  
                  // 質問と回答の配列を作成
                  const displayData: Array<{
                    questionTitle: string;
                    questionId: number;
                    answer: string;
                    label: string;
                    type: string;
                    severityScore: number;
                  }> = [];
                  
                  if (Object.keys(questionAnswers).length > 0) {
                    // 新しい形式（質問タイトル付き）
                    Object.entries(questionAnswers).forEach(([questionTitle, data]: [string, any]) => {
                      displayData.push({
                        questionTitle: questionTitle,
                        questionId: data.questionId,
                        answer: data.answer,
                        label: data.label,
                        type: data.type,
                        severityScore: data.severityScore
                      });
                    });
                  } else {
                    // 古い形式（質問番号のみ）の場合、質問タイトルを復元
                    Object.entries(rawAnswers).forEach(([questionId, answer]) => {
                      const questionIndex = parseInt(questionId) - 1;
                      const questionTitle = questionTitles[questionIndex] || `質問${questionId}`;
                      
                      // 質問オブジェクトから回答ラベルを取得
                      const question = questions.find(q => q.id === parseInt(questionId));
                      const option = question?.options.find(opt => opt.value === answer);
                      
                      displayData.push({
                        questionTitle: questionTitle,
                        questionId: parseInt(questionId),
                        answer: answer as string,
                        label: option?.label || answer as string,
                        type: option?.type || 'unknown',
                        severityScore: getSeverityScore(answer as string)
                      });
                    });
                  }
                  
                  // 質問ID順にソート
                  displayData.sort((a, b) => a.questionId - b.questionId);
                  
                  return displayData.map((item, index) => (
                    <div key={item.questionId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-gray-800 flex-1">{item.questionTitle}</div>
                        <div className="text-sm text-gray-500 ml-2">Q{item.questionId}</div>
                      </div>
                      <div className="text-gray-600 mb-1">回答: {item.label}</div>
                      <div className="text-sm text-gray-500">
                        タイプ: {bodyTypes[item.type as keyof typeof bodyTypes]?.name || item.type} 
                        (スコア: {item.severityScore})
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* メニュー推薦セクション */}
        {(() => {
          const menuRecommendation = getMenuRecommendations(result);
          if (!menuRecommendation) return null;

          return (
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 md:p-8 shadow-lg mb-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-heart-line text-white text-xl md:text-2xl"></i>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">あなたにおすすめのメニュー</h3>
                <p className="text-gray-600">{menuRecommendation.explanation}</p>
              </div>

              {/* 期待できる効果 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">期待できる効果</h4>
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
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">特におすすめのメニュー</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuRecommendation.primaryRecommendations.map((menuItem) => (
                    <div key={menuItem.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 text-sm md:text-base mb-1 line-clamp-2">
                            {menuItem.title}
                          </h5>
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
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-full transition">
                          詳細
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* その他のおすすめメニュー */}
              {menuRecommendation.secondaryRecommendations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">その他のおすすめメニュー</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuRecommendation.secondaryRecommendations.map((menuItem) => (
                      <div key={menuItem.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 text-sm md:text-base mb-1 line-clamp-2">
                              {menuItem.title}
                            </h5>
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
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{menuItem.description}</p>
                        <div className="flex gap-2">
                          <Link 
                            href={`/reservation?menu=${menuItem.id}&result=${result}`}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition flex-1 text-center"
                          >
                            このメニューで予約
                          </Link>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-full transition">
                            詳細
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 全メニューを見るボタン */}
              <div className="text-center">
                <Link 
                  href="/menu"
                  className="bg-white hover:bg-gray-50 text-pink-600 border-2 border-pink-500 px-6 md:px-8 py-3 rounded-full text-base md:text-lg font-semibold transition-all inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  全メニューを見る
                </Link>
              </div>
            </div>
          );
        })()}

        <div className="text-center space-y-4 mb-12 md:mb-16">
          <Link href={`/reservation?result=${result}`} className="bg-pink-500 hover:bg-pink-600 text-white px-6 md:px-8 py-3 md:py-3 rounded-full text-base md:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center mr-0 md:mr-4 mb-4 md:mb-0">
              この結果で予約する
            </Link>
          <Link href="/blends" className="bg-white hover:bg-gray-50 text-pink-600 border-2 border-pink-500 px-6 md:px-8 py-3 md:py-3 rounded-full text-base md:text-lg font-semibold transition-all inline-block whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center">
            他のブレンドも見る
          </Link>
        </div>
        <div className="text-center mb-12 md:mb-16">
            <button 
              onClick={() => { setResult(null); setCurrentQuestion(0); setAnswers({}); }}
            className="text-gray-500 hover:text-gray-700 underline cursor-pointer text-sm md:text-base"
            >
              もう一度診断する
            </button>
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
            <Link href="/diagnosis" className="text-pink-600 font-semibold cursor-pointer">体質診断</Link>
            <Link href="/blends" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">ハーブ紹介</Link>
            <Link href="/menu" className="text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">メニュー</Link>
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
                  className="block py-3 text-pink-600 font-semibold border-b border-gray-100"
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
                  className="block py-3 text-gray-700 hover:text-pink-600 transition-colors border-b border-gray-100"
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
      {result && (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {diagnosisResultSection}
        </div>
      )}
      {!result && (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* 体質診断タイトル */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full mb-6 shadow-lg">
              <span className="text-2xl md:text-3xl">🌸</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">
                体質診断
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600">あなたの体質に合わせたよもぎ蒸しブレンドをご提案します</p>
          </div>

          {/* 8つの体質タイプ紹介 */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                8つの体質タイプ
              </span>
            </h2>
            {/* 体質タイプグラフ */}
            <div className="relative max-w-3xl mx-auto">
              {/* グラフの軸 */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl md:rounded-2xl border-2 border-gray-200 p-2 md:p-6">
                {/* 縦軸（エネルギー） */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gray-300 transform -translate-x-1/2 z-0"></div>
                <div className="absolute left-1/2 top-2 md:top-4 transform -translate-x-1/2 text-xs md:text-lg font-bold text-gray-700 z-10">エネルギー高</div>
                <div className="absolute left-1/2 bottom-2 md:bottom-4 transform -translate-x-1/2 text-xs md:text-lg font-bold text-gray-700 z-10">エネルギー低</div>
                {/* 横軸（温度） */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 md:h-1 bg-gray-300 transform -translate-y-1/2 z-0"></div>
                <div className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 text-xs md:text-lg font-bold text-gray-700 z-10 rotate-[-15deg]">温め</div>
                <div className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 text-xs md:text-lg font-bold text-gray-700 z-10 rotate-[15deg]">冷え</div>

                {/* 体質タイプの配置（スマホ対応） */}
                <div className="relative w-full h-full">
                  {/* 四隅 */}
                  {/* 左上：ストレス・疲労 */}
                  <div className="absolute left-2 md:left-8 top-2 md:top-8 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center shadow-lg border-2 border-purple-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['stress']} alt="ストレス・疲労" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-purple-600 text-xs md:text-sm text-center">ストレス・疲労</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">慢性疲労・イライラ</div>
                  </div>
                  {/* 右上：ホルモンバランス */}
                  <div className="absolute right-2 md:right-8 top-2 md:top-8 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 rounded-full flex items-center justify-center shadow-lg border-2 border-pink-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['hormone']} alt="ホルモンバランス" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-pink-600 text-xs md:text-sm text-center">ホルモンバランス</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">生理不順・PMS</div>
                  </div>
                  {/* 左下：むくみ・水分代謝 */}
                  <div className="absolute left-2 md:left-8 bottom-2 md:bottom-8 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-100 rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['swelling']} alt="むくみ・水分代謝" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-cyan-600 text-xs md:text-sm text-center">むくみ・水分代謝</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">むくみ・水分代謝不良</div>
                  </div>
                  {/* 右下：冷え性 */}
                  <div className="absolute right-2 md:right-8 bottom-2 md:bottom-8 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['cold']} alt="冷え性" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-blue-600 text-xs md:text-sm text-center">冷え性</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">手足の冷え・血行不良</div>
                  </div>
                  {/* 上中央：美肌 */}
                  <div className="absolute left-1/2 top-2 md:top-8 transform -translate-x-1/2 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center shadow-lg border-2 border-rose-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['skin']} alt="美肌" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-rose-600 text-xs md:text-sm text-center">美肌</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">肌のトラブル</div>
                  </div>
                  {/* 下中央：消化器系 */}
                  <div className="absolute left-1/2 bottom-2 md:bottom-8 transform -translate-x-1/2 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['digestive']} alt="消化器系" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-yellow-600 text-xs md:text-sm text-center">消化器系</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">胃腸の不調</div>
                  </div>
                  {/* 右中央：安眠 */}
                  <div className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg border-2 border-indigo-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['sleep']} alt="安眠" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-indigo-600 text-xs md:text-sm text-center">安眠</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">睡眠障害</div>
                  </div>
                  {/* 左中央：バランス */}
                  <div className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center w-20 md:w-28">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center shadow-lg border-2 border-green-200 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['balanced']} alt="バランス" width={48} height={48} className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-green-600 text-xs md:text-sm text-center">バランス</div>
                    <div className="text-xs text-gray-600 text-center hidden md:block">バランスの取れた体質</div>
                  </div>
                  {/* 中央：バランス（大きめ） */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-24 md:w-32 z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-200 rounded-full flex items-center justify-center shadow-lg border-4 border-green-300 mb-1 md:mb-2 overflow-hidden">
                      <Image src={typeImageMap['balanced']} alt="バランス" width={64} height={64} className="w-14 h-14 md:w-18 md:h-18 object-contain rounded-full object-cover bg-white p-1" />
                    </div>
                    <div className="font-bold text-green-700 text-sm md:text-base text-center">バランスタイプ</div>
                    <div className="text-xs text-gray-700 text-center hidden md:block">バランスの取れた体質</div>
                  </div>
                </div>
              </div>
              {/* グラフの説明 */}
              <div className="mt-4 md:mt-6 text-center">
                <p className="text-xs md:text-sm text-gray-600">
                  8つの体質タイプの特徴が一目で分かります
                </p>
              </div>
            </div>
          </div>

          {/* 診断開始セクション */}
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-300 via-pink-300 to-rose-400 rounded-xl md:rounded-2xl p-4 md:p-8 text-center text-white mb-6 md:mb-12 shadow-xl">
            <div className="relative">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white bg-opacity-25 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner border-2 border-white border-opacity-30">
                <span className="text-white text-xl md:text-3xl">💝</span>
              </div>
              <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-white drop-shadow-lg">あなたの体質を理解しましょう</h2>
              <p className="text-white/90 text-xs md:text-base mb-4 md:mb-6 drop-shadow">約5分の詳細診断で、あなたの体の特徴と最適なケア方法が分かります</p>
              <div className="bg-white/90 rounded-lg md:rounded-xl p-3 md:p-5 text-left border border-white/60 shadow-md">
                <h3 className="font-semibold mb-2 md:mb-3 text-pink-700 text-sm md:text-base">診断で分かること</h3>
                <ul className="text-xs md:text-sm space-y-1 md:space-y-2 text-gray-700">
                  <li>・あなたの体質タイプ（8つのタイプから判定）</li>
                  <li>・現在の不調の原因と改善方法</li>
                  <li>・あなたに最適なよもぎ蒸しブレンド</li>
                  <li>・日常でできる具体的なケア方法</li>
                </ul>
              </div>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="mb-4 md:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-base text-gray-600">進捗</span>
              <span className="text-xs md:text-base text-gray-600">{currentQuestion + 1} / {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-3">
              <div 
                className="bg-gradient-to-r from-rose-300 to-pink-400 h-1.5 md:h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 質問カード */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 md:mb-8">
            {questions[currentQuestion].question}
          </h3>
            <div className="space-y-3 md:space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                  className={`w-full p-4 md:p-5 rounded-lg border-2 text-left transition-all duration-300 ${
                  answers[questions[currentQuestion].id] === option.value 
                      ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-md scale-105'
                      : 'border-gray-200 hover:border-rose-300 hover:bg-rose-25 text-gray-700 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                      {answers[questions[currentQuestion].id] === option.value && (
                      <i className="ri-check-line text-rose-600 text-lg"></i>
                      )}
                  </div>
                </button>
            ))}
          </div>
            <div className="flex justify-between mt-6 md:mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all ${
              currentQuestion === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            前の質問
          </button>
          <button
                onClick={currentQuestion === questions.length - 1 ? calculateResult : nextQuestion}
            disabled={!answers[questions[currentQuestion].id]}
                className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium transition-all ${
              !answers[questions[currentQuestion].id]
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-300 to-pink-400 text-white hover:from-rose-400 hover:to-pink-500 shadow-md'
            }`}
          >
            {currentQuestion === questions.length - 1 ? '診断結果を見る' : '次の質問'}
          </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
