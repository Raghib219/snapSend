-- ============================================
-- SUPABASE DATABASE SETUP
-- Real-Time Budget Nudge Agent
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nudge_personality VARCHAR(20) DEFAULT 'friendly',
  notification_enabled BOOLEAN DEFAULT true,
  daily_digest_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 2. BUDGETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, month, year)
);

CREATE INDEX idx_budgets_user_month ON budgets(user_id, month, year);

-- ============================================
-- 3. TRANSACTIONS TABLE (MAIN)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  merchant VARCHAR(255),
  transaction_type VARCHAR(10) CHECK (transaction_type IN ('DR', 'CR')),
  is_duplicate BOOLEAN DEFAULT false,
  categorization_method VARCHAR(20) DEFAULT 'rule_based',
  month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM date)) STORED,
  year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, month, year);

-- ============================================
-- 4. NUDGES TABLE (Real-time notifications)
-- ============================================
CREATE TABLE IF NOT EXISTS nudges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  nudge_type VARCHAR(20) CHECK (nudge_type IN ('soft_warning', 'critical_warning', 'overspending')),
  threshold_percentage INTEGER,
  budget_limit DECIMAL(10,2),
  current_spent DECIMAL(10,2),
  personality VARCHAR(20) DEFAULT 'friendly',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nudges_user_unread ON nudges(user_id, is_read, created_at DESC);

-- Enable real-time for nudges table
ALTER PUBLICATION supabase_realtime ADD TABLE nudges;

-- ============================================
-- 5. MONTHLY SUMMARIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS monthly_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  category VARCHAR(50) NOT NULL,
  total_spent DECIMAL(10,2) DEFAULT 0,
  budget_limit DECIMAL(10,2),
  transaction_count INTEGER DEFAULT 0,
  top_merchant VARCHAR(255),
  avg_transaction DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month, year, category)
);

CREATE INDEX idx_monthly_summaries_user ON monthly_summaries(user_id, year DESC, month DESC);

-- ============================================
-- 6. MERCHANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant_name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  total_spent DECIMAL(10,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  last_transaction_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, merchant_name)
);

CREATE INDEX idx_merchants_user_spent ON merchants(user_id, total_spent DESC);

-- ============================================
-- 7. SAMPLE DATA (For Testing)
-- ============================================

-- Insert sample transactions for demo user
-- Replace 'YOUR_USER_ID' with actual user ID from auth.users

-- Sample transactions for February 2026
INSERT INTO transactions (user_id, date, description, amount, category, merchant, transaction_type, categorization_method)
VALUES
  -- Income
  ('YOUR_USER_ID', '2026-02-01', 'Salary Credit', 50000.00, 'Income', 'Company XYZ', 'CR', 'rule_based'),
  
  -- Food expenses (overspending scenario)
  ('YOUR_USER_ID', '2026-02-02', 'Swiggy Food Order', 850.00, 'Food', 'Swiggy', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-03', 'Starbucks Coffee', 320.00, 'Food', 'Starbucks', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-05', 'Zomato Dinner', 920.00, 'Food', 'Zomato', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-08', 'Swiggy Lunch', 650.00, 'Food', 'Swiggy', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-10', 'Starbucks Coffee', 310.00, 'Food', 'Starbucks', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-12', 'Swiggy Breakfast', 450.00, 'Food', 'Swiggy', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-14', 'Zomato Valentine Dinner', 1800.00, 'Food', 'Zomato', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-16', 'Swiggy Lunch', 720.00, 'Food', 'Swiggy', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-19', 'Starbucks Coffee', 330.00, 'Food', 'Starbucks', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-20', 'Swiggy Dinner', 980.00, 'Food', 'Swiggy', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-22', 'Zomato Lunch', 680.00, 'Food', 'Zomato', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-24', 'Swiggy Order', 850.00, 'Food', 'Swiggy', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-27', 'Swiggy Dinner', 920.00, 'Food', 'Swiggy', 'DR', 'rule_based'),
  
  -- Travel expenses
  ('YOUR_USER_ID', '2026-02-04', 'Uber Ride to Office', 280.00, 'Travel', 'Uber', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-10', 'Ola Cab', 240.00, 'Travel', 'Ola', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-17', 'Uber Ride', 290.00, 'Travel', 'Uber', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-25', 'Ola Ride', 260.00, 'Travel', 'Ola', 'DR', 'rule_based'),
  
  -- Shopping
  ('YOUR_USER_ID', '2026-02-05', 'Amazon Shopping - Electronics', 4500.00, 'Shopping', 'Amazon', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-09', 'Flipkart Shopping - Clothes', 3200.00, 'Shopping', 'Flipkart', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-18', 'Amazon Shopping - Books', 890.00, 'Shopping', 'Amazon', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-21', 'Myntra Shopping', 2500.00, 'Shopping', 'Myntra', 'DR', 'rule_based'),
  
  -- Bills
  ('YOUR_USER_ID', '2026-02-07', 'Netflix Subscription', 799.00, 'Bills', 'Netflix', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-15', 'Electricity Bill', 1200.00, 'Bills', 'Electricity Board', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-23', 'Mobile Recharge', 599.00, 'Bills', 'Airtel', 'DR', 'rule_based'),
  
  -- Groceries
  ('YOUR_USER_ID', '2026-02-13', 'DMart Groceries', 2100.00, 'Groceries', 'DMart', 'DR', 'rule_based'),
  ('YOUR_USER_ID', '2026-02-26', 'BigBasket Groceries', 1800.00, 'Groceries', 'BigBasket', 'DR', 'rule_based');

-- Insert sample budgets
INSERT INTO budgets (user_id, category, monthly_limit, month, year)
VALUES
  ('YOUR_USER_ID', 'Food', 5000.00, 2, 2026),
  ('YOUR_USER_ID', 'Travel', 3000.00, 2, 2026),
  ('YOUR_USER_ID', 'Shopping', 10000.00, 2, 2026),
  ('YOUR_USER_ID', 'Bills', 4000.00, 2, 2026),
  ('YOUR_USER_ID', 'Groceries', 5000.00, 2, 2026);

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

-- Policies for user_settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for budgets
CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for nudges
CREATE POLICY "Users can view own nudges" ON nudges
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own nudges" ON nudges
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own nudges" ON nudges
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for monthly_summaries
CREATE POLICY "Users can view own summaries" ON monthly_summaries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own summaries" ON monthly_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own summaries" ON monthly_summaries
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for merchants
CREATE POLICY "Users can view own merchants" ON merchants
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own merchants" ON merchants
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own merchants" ON merchants
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_summaries_updated_at BEFORE UPDATE ON monthly_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. VIEWS FOR ANALYTICS
-- ============================================

-- View for recent transactions
CREATE OR REPLACE VIEW recent_transactions_view AS
SELECT 
  t.id,
  t.user_id,
  t.date,
  t.description,
  t.amount,
  t.category,
  t.merchant,
  t.transaction_type,
  t.created_at
FROM transactions t
WHERE t.transaction_type = 'DR'
ORDER BY t.date DESC, t.created_at DESC
LIMIT 10;

-- View for category spending summary
CREATE OR REPLACE VIEW category_spending_view AS
SELECT 
  user_id,
  category,
  month,
  year,
  SUM(amount) as total_spent,
  COUNT(*) as transaction_count,
  AVG(amount) as avg_amount
FROM transactions
WHERE transaction_type = 'DR'
GROUP BY user_id, category, month, year;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- To use this:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and run
-- 4. Replace 'YOUR_USER_ID' with your actual user ID
-- 5. Test by querying: SELECT * FROM transactions;
