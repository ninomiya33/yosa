# yosaPARK - よもぎ蒸しサロン

自然の恵みで心と体を癒す、伝統的なよもぎ蒸しサロンのWebサイトです。

**最終更新**: 2024年7月28日 15:30 JST
**デプロイ確認**: 最新の変更を反映中

## 機能

- **体質診断**: 30問の詳細な診断で8つの体質タイプを判定
- **ブレンド紹介**: 11種類のハーブを使用した8種類のオリジナルブレンド
- **オンライン予約**: カレンダー形式の予約システム（30分単位）
- **お問い合わせ**: お客様からのお問い合わせフォーム
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## ブレンドメニュー

### 8種類のオリジナルブレンド
1. **温活ブレンド** - 冷え性・血行不良の方に
2. **リラックスブレンド** - ストレス・疲労の方に
3. **デトックスブレンド** - むくみ・水分代謝の方に
4. **女性ケアブレンド** - ホルモンバランスの方に
5. **胃腸ケアブレンド** - 消化器系の方に
6. **安眠ブレンド** - 睡眠障害の方に
7. **美肌ブレンド** - 美容効果を求める方に
8. **バランスブレンド** - 全体のバランスを整えたい方に

### 使用ハーブ（11種類）
ガイヨウ、トウキ、ケイヒ、インチンコウ、ビャクシ、トウヒ、ウイキョウ、カミツレ、チョウジ、チンビ、センキュウ

## 技術スタック

- **フレームワーク**: Next.js 15.3.2 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **メール送信**: Nodemailer
- **フォント**: Google Fonts (Orbitron, Righteous, Pacifico)
- **カレンダー**: react-calendar

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# メール設定
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# JWT設定
JWT_SECRET=your_jwt_secret_here

# NextAuth設定
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 3. 開発サーバーの起動

```