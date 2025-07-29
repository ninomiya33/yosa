-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Body types table
CREATE TABLE body_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blends table
CREATE TABLE blends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diagnoses table
CREATE TABLE diagnoses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  body_type_id UUID NOT NULL REFERENCES body_types(id),
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  blend_id UUID NOT NULL REFERENCES blends(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'READ', 'REPLIED', 'CLOSED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_diagnoses_user_id ON diagnoses(user_id);
CREATE INDEX idx_diagnoses_body_type_id ON diagnoses(body_type_id);
CREATE INDEX idx_diagnoses_created_at ON diagnoses(created_at);

CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_blend_id ON reservations(blend_id);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- Insert initial data for body types
INSERT INTO body_types (key, name, description, color) VALUES
('cold', '冷え性タイプ', '手足の冷え、寒がり、温かいものを好む', 'blue'),
('stress', 'ストレスタイプ', 'イライラ、不安、緊張、不眠', 'purple'),
('swelling', 'むくみタイプ', '手足のむくみ、重だるさ、水分代謝の悪さ', 'cyan'),
('hormone', 'ホルモンバランスタイプ', '生理不順、PMS、更年期症状', 'pink'),
('digestive', '消化器タイプ', '胃もたれ、便秘、下痢、食欲不振', 'yellow'),
('sleep', '睡眠タイプ', '不眠、浅い眠り、疲れが取れない', 'indigo'),
('skin', '肌タイプ', '肌荒れ、乾燥、ニキビ、アトピー', 'green'),
('balanced', 'バランスタイプ', '比較的健康、軽い不調がある程度', 'emerald');

-- Insert initial data for blends
INSERT INTO blends (key, name, description, price, color) VALUES
('basic', '基本よもぎブレンド', '初心者におすすめの基本ブレンド', 3000, 'emerald'),
('warming', '温活ブレンド（生姜＋よもぎ）', '冷え性の方におすすめ', 3500, 'red'),
('detox', 'デトックスブレンド', 'むくみが気になる方におすすめ', 3500, 'cyan'),
('relaxing', 'リラックスブレンド（ラベンダー＋よもぎ）', 'ストレスを感じる方におすすめ', 3500, 'purple'),
('hormone', 'ホルモンバランスブレンド', '女性特有のお悩みにおすすめ', 4000, 'pink'),
('beauty', '美肌ブレンド', '美容効果を求める方におすすめ', 4000, 'rose');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE blends ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to body_types and blends
CREATE POLICY "Allow public read access to body_types" ON body_types FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blends" ON blends FOR SELECT USING (true);

-- Create policies for diagnoses
CREATE POLICY "Allow public insert to diagnoses" ON diagnoses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to read their own diagnoses" ON diagnoses FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for reservations
CREATE POLICY "Allow public insert to reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to read their own reservations" ON reservations FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for contacts
CREATE POLICY "Allow public insert to contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read access to contacts" ON contacts FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_body_types_updated_at BEFORE UPDATE ON body_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blends_updated_at BEFORE UPDATE ON blends FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 