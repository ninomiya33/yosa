import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import nodemailer from 'nodemailer';

// 予約作成API
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const blend = formData.get('blend') as string;
    const menu = formData.get('menu') as string;
    const message = formData.get('message') as string;

    // バリデーション
    if (!name || !email || !phone || !date || !time || !blend) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // ブレンドの存在確認
    const { data: blendRecord, error: blendError } = await supabase
      .from('blends')
      .select('*')
      .eq('key', blend)
      .single();

    if (blendError || !blendRecord) {
      return NextResponse.json(
        { error: '指定されたブレンドが見つかりません' },
        { status: 400 }
      );
    }

    // 予約日時の重複チェック
    const { data: existingReservation, error: checkError } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .in('status', ['PENDING', 'CONFIRMED'])
      .single();

    if (existingReservation) {
      return NextResponse.json(
        { error: '指定された日時は既に予約されています' },
        { status: 409 }
      );
    }

    // 予約を作成
    const { data: reservation, error: insertError } = await supabase
      .from('reservations')
      .insert({
        name,
        email,
        phone,
        date,
        time,
        message: message || null,
        menu: menu || null,
        blend_id: blendRecord.id,
        status: 'PENDING'
      })
      .select(`
        *,
        blends (*)
      `)
      .single();

    if (insertError) {
      console.error('予約作成エラー:', insertError);
      return NextResponse.json(
        { error: '予約の作成に失敗しました' },
        { status: 500 }
      );
    }

    // 確認メールを送信
    await sendConfirmationEmail(reservation);

    return NextResponse.json(
      { 
        message: '予約が完了しました',
        reservationId: reservation.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('予約作成エラー:', error);
    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// 予約一覧取得API（管理者用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = supabase
      .from('reservations')
      .select(`
        *,
        blends (*),
        users (id, name, email)
      `)
      .order('date', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.gte('date', date).lt('date', nextDay.toISOString().split('T')[0]);
    }

    const { data: reservations, error } = await query;

    if (error) {
      console.error('予約取得エラー:', error);
      return NextResponse.json(
        { error: '予約の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(reservations);

  } catch (error) {
    console.error('予約取得エラー:', error);
    return NextResponse.json(
      { error: '予約の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 確認メール送信関数
async function sendConfirmationEmail(reservation: any) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.email,
      subject: '【よもぎ蒸しサロン】ご予約確認',
      html: `
        <div style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; text-align: center;">よもぎ蒸しサロン</h2>
          <h3 style="color: #374151;">ご予約確認</h3>
          
          <p>${reservation.name} 様</p>
          <p>ご予約ありがとうございます。以下の内容で承りました。</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #374151; margin-top: 0;">予約詳細</h4>
            <p><strong>予約番号:</strong> ${reservation.id}</p>
            <p><strong>日時:</strong> ${new Date(reservation.date).toLocaleDateString('ja-JP')} ${reservation.time}</p>
            <p><strong>ブレンド:</strong> ${reservation.blends?.name || '不明'}</p>
            ${reservation.menu ? `<p><strong>メニュー:</strong> ${reservation.menu}</p>` : ''}
            <p><strong>お名前:</strong> ${reservation.name}</p>
            <p><strong>メール:</strong> ${reservation.email}</p>
            <p><strong>電話番号:</strong> ${reservation.phone}</p>
            ${reservation.message ? `<p><strong>ご要望:</strong> ${reservation.message}</p>` : ''}
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">ご来店時の注意事項</h4>
            <ul style="color: #92400e;">
              <li>施術時間は約60分です</li>
              <li>変更・キャンセルは前日までにご連絡ください</li>
              <li>妊娠中の方は事前にご相談ください</li>
            </ul>
          </div>
          
          <p>ご質問がございましたら、お気軽にお問い合わせください。</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              よもぎ蒸しサロン<br>
              〒150-0002 東京都渋谷区〇〇1-2-3<br>
              TEL: 03-1234-5678<br>
              Email: info@yomogi.jp
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('確認メール送信完了:', reservation.email);

  } catch (error) {
    console.error('メール送信エラー:', error);
    // メール送信に失敗しても予約は作成される
  }
} 