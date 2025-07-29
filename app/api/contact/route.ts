import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import nodemailer from 'nodemailer';

// お問い合わせ送信API
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // バリデーション
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // お問い合わせを保存
    const { data: contact, error: insertError } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'UNREAD'
      })
      .select()
      .single();

    if (insertError) {
      console.error('お問い合わせ保存エラー:', insertError);
      return NextResponse.json(
        { error: 'お問い合わせの保存に失敗しました' },
        { status: 500 }
      );
    }

    // 管理者に通知メールを送信
    await sendNotificationEmail(contact);

    // 送信者に確認メールを送信
    await sendConfirmationEmail(contact);

    return NextResponse.json(
      { 
        message: 'お問い合わせが送信されました',
        contactId: contact.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('お問い合わせ送信エラー:', error);
    return NextResponse.json(
      { error: 'お問い合わせの送信に失敗しました' },
      { status: 500 }
    );
  }
}

// お問い合わせ一覧取得API（管理者用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: contacts, error } = await query;

    if (error) {
      console.error('お問い合わせ取得エラー:', error);
      return NextResponse.json(
        { error: 'お問い合わせの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(contacts);

  } catch (error) {
    console.error('お問い合わせ取得エラー:', error);
    return NextResponse.json(
      { error: 'お問い合わせの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 管理者通知メール送信関数
async function sendNotificationEmail(contact: any) {
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
      to: process.env.EMAIL_USER, // 管理者のメールアドレス
      subject: `【よもぎ蒸しサロン】新しいお問い合わせ: ${contact.subject}`,
      html: `
        <div style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">新しいお問い合わせ</h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #374151; margin-top: 0;">お問い合わせ詳細</h4>
            <p><strong>件名:</strong> ${contact.subject}</p>
            <p><strong>お名前:</strong> ${contact.name}</p>
            <p><strong>メール:</strong> ${contact.email}</p>
            <p><strong>送信日時:</strong> ${new Date(contact.created_at).toLocaleString('ja-JP')}</p>
            <p><strong>メッセージ:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${contact.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>管理画面から返信をお願いします。</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('管理者通知メール送信完了');

  } catch (error) {
    console.error('管理者通知メール送信エラー:', error);
  }
}

// 送信者確認メール送信関数
async function sendConfirmationEmail(contact: any) {
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
      to: contact.email,
      subject: '【よもぎ蒸しサロン】お問い合わせ受付確認',
      html: `
        <div style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; text-align: center;">よもぎ蒸しサロン</h2>
          <h3 style="color: #374151;">お問い合わせ受付確認</h3>
          
          <p>${contact.name} 様</p>
          <p>お問い合わせありがとうございます。以下の内容で承りました。</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #374151; margin-top: 0;">お問い合わせ内容</h4>
            <p><strong>件名:</strong> ${contact.subject}</p>
            <p><strong>お名前:</strong> ${contact.name}</p>
            <p><strong>メール:</strong> ${contact.email}</p>
            <p><strong>送信日時:</strong> ${new Date(contact.created_at).toLocaleString('ja-JP')}</p>
            <p><strong>メッセージ:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${contact.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>内容を確認の上、担当者よりご連絡いたします。</p>
          <p>しばらくお待ちください。</p>
          
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
    console.log('確認メール送信完了:', contact.email);

  } catch (error) {
    console.error('確認メール送信エラー:', error);
  }
} 