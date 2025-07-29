# Supabase セットアップ手順

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクト名: `yomogi-salon` (または任意の名前)
4. データベースパスワードを設定して保存

## 2. データベーススキーマの設定

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase-schema.sql` ファイルの内容をコピーして実行
3. これにより以下のテーブルが作成されます：
   - `users` - ユーザー管理
   - `body_types` - 体質タイプ
   - `blends` - ブレンド
   - `diagnoses` - 診断結果
   - `reservations` - 予約
   - `contacts` - お問い合わせ

## 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### Supabase設定値の取得方法：

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. `Project URL` を `NEXT_PUBLIC_SUPABASE_URL` に設定
3. `anon public` キーを `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定
4. `DATABASE_URL` は「Database」→「Connection string」から取得

## 4. アプリケーションの起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 5. 動作確認

1. ブラウザで `http://localhost:3000` にアクセス
2. 体質診断を実行
3. 予約フォームを送信
4. お問い合わせフォームを送信

## 6. データベースの確認

Supabaseダッシュボードの「Table Editor」で以下を確認：

- `body_types` テーブルに8つの体質タイプが登録されている
- `blends` テーブルに6つのブレンドが登録されている
- 診断や予約を実行すると、対応するテーブルにデータが保存される

## 7. メール機能の設定

Gmailを使用する場合：

1. Gmailアカウントで2段階認証を有効化
2. アプリパスワードを生成
3. `.env.local` の `EMAIL_USER` と `EMAIL_PASS` を設定

## 8. 本番環境へのデプロイ

1. Vercel、Netlify、またはその他のプラットフォームにデプロイ
2. 環境変数を本番環境でも設定
3. Supabaseの本番環境設定を確認

## トラブルシューティング

### データベース接続エラー
- `DATABASE_URL` が正しく設定されているか確認
- Supabaseプロジェクトが起動しているか確認

### 認証エラー
- `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しく設定されているか確認

### メール送信エラー
- Gmailのアプリパスワードが正しく設定されているか確認
- 2段階認証が有効になっているか確認 