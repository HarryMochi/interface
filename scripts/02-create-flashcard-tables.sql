-- Create flashcard_sets table
CREATE TABLE IF NOT EXISTS flashcard_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  card_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  mastered BOOLEAN DEFAULT FALSE,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own flashcard sets" ON flashcard_sets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own flashcard sets" ON flashcard_sets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own flashcard sets" ON flashcard_sets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view flashcards in their sets" ON flashcards FOR SELECT USING (
  set_id IN (SELECT id FROM flashcard_sets WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert flashcards in their sets" ON flashcards FOR INSERT WITH CHECK (
  set_id IN (SELECT id FROM flashcard_sets WHERE user_id = auth.uid())
);
