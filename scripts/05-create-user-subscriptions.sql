-- User Subscriptions & Usage Limits
-- This table tracks user subscription plans and usage limits

-- Create user_subscriptions table for plan management
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  plan_type VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'enterprise')),
  
  -- Configurable limits (can be adjusted per plan or per user)
  quiz_limit INTEGER NOT NULL DEFAULT 5,
  flashcard_limit INTEGER NOT NULL DEFAULT 5,
  tutor_messages_limit INTEGER NOT NULL DEFAULT 20,
  
  -- Current usage (resets monthly or as configured)
  quizzes_used INTEGER NOT NULL DEFAULT 0,
  flashcards_used INTEGER NOT NULL DEFAULT 0,
  tutor_messages_used INTEGER NOT NULL DEFAULT 0,
  
  -- Billing and subscription metadata
  usage_reset_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_type ON user_subscriptions(plan_type);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscription (for auto-creation on signup)
CREATE POLICY "Users can insert their own subscription"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscription usage
CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Plan limits configuration table (for admins to configure limits)
CREATE TABLE IF NOT EXISTS plan_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type VARCHAR(20) NOT NULL UNIQUE CHECK (plan_type IN ('free', 'premium', 'enterprise')),
  quiz_limit INTEGER NOT NULL,
  flashcard_limit INTEGER NOT NULL,
  tutor_messages_limit INTEGER NOT NULL,
  price_monthly DECIMAL(10, 2),
  price_yearly DECIMAL(10, 2),
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plan configurations
INSERT INTO plan_limits (plan_type, quiz_limit, flashcard_limit, tutor_messages_limit, price_monthly, price_yearly, features) 
VALUES 
  ('free', 5, 5, 20, 0, 0, '["Basic AI Tutor", "5 Quizzes/month", "5 Flashcard Sets/month", "Basic Analytics"]'::jsonb),
  ('premium', 100, 100, 500, 9.99, 99.99, '["Unlimited AI Tutor", "100 Quizzes/month", "100 Flashcard Sets/month", "Advanced Analytics", "Priority Support", "Export Results"]'::jsonb),
  ('enterprise', -1, -1, -1, 29.99, 299.99, '["Unlimited Everything", "Custom Branding", "API Access", "Dedicated Support", "Team Management"]'::jsonb)
ON CONFLICT (plan_type) DO NOTHING;

-- Function to auto-create subscription for new users
CREATE OR REPLACE FUNCTION create_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, plan_type, quiz_limit, flashcard_limit, tutor_messages_limit)
  VALUES (NEW.id, 'free', 5, 5, 20)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create subscription when user_profiles is created
DROP TRIGGER IF EXISTS on_user_profile_created ON user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_subscription();

-- Function to reset usage monthly
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE user_subscriptions
  SET 
    quizzes_used = 0,
    flashcards_used = 0,
    tutor_messages_used = 0,
    usage_reset_date = NOW() + INTERVAL '30 days',
    updated_at = NOW()
  WHERE usage_reset_date <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
