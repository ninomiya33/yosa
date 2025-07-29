import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// 診断結果保存API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bodyTypeKey, answers, rawAnswers, typeScores, typeCount, questionTitles, userId } = body;

    // バリデーション
    if (!bodyTypeKey || !answers) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // 体質タイプの存在確認
    const { data: bodyType, error: bodyTypeError } = await supabase
      .from('body_types')
      .select('*')
      .eq('key', bodyTypeKey)
      .single();

    if (bodyTypeError || !bodyType) {
      return NextResponse.json(
        { error: '指定された体質タイプが見つかりません' },
        { status: 400 }
      );
    }

    // 保存用のデータを構築
    const diagnosisData = {
      body_type_id: bodyType.id,
      answers: {
        questionAnswers: answers, // 質問タイトル → 回答の詳細
        rawAnswers: rawAnswers || {}, // 元の回答データ
        typeScores: typeScores || {}, // 各タイプのスコア
        typeCount: typeCount || {}, // 各タイプの回答数
        questionTitles: questionTitles || [], // 質問タイトル配列
        summary: {
          totalQuestions: Object.keys(answers).length,
          dominantType: bodyTypeKey,
          dominantScore: typeScores?.[bodyTypeKey] || 0,
          allScores: typeScores || {},
          questionCount: questionTitles?.length || 0
        }
      },
      user_id: userId || null
    };

    // 診断結果を保存
    const { data: diagnosis, error: insertError } = await supabase
      .from('diagnoses')
      .insert(diagnosisData)
      .select(`
        *,
        body_types (*),
        users (id, name, email)
      `)
      .single();

    if (insertError) {
      console.error('診断結果保存エラー:', insertError);
      return NextResponse.json(
        { error: '診断結果の保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: '診断結果が保存されました',
        diagnosis: diagnosis,
        bodyType: bodyType
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('診断結果保存エラー:', error);
    return NextResponse.json(
      { error: '診断結果の保存に失敗しました' },
      { status: 500 }
    );
  }
}

// 診断結果取得API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const bodyTypeKey = searchParams.get('bodyTypeKey');

    let query = supabase
      .from('diagnoses')
      .select(`
        *,
        body_types (*),
        users (id, name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (bodyTypeKey) {
      query = query.eq('body_types.key', bodyTypeKey);
    }

    const { data: diagnoses, error } = await query;

    if (error) {
      console.error('診断結果取得エラー:', error);
      return NextResponse.json(
        { error: '診断結果の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(diagnoses);

  } catch (error) {
    console.error('診断結果取得エラー:', error);
    return NextResponse.json(
      { error: '診断結果の取得に失敗しました' },
      { status: 500 }
    );
  }
} 