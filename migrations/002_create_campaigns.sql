CREATE TABLE IF NOT EXISTS campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  emoji       TEXT DEFAULT '🎯',
  color       TEXT DEFAULT '#D63B3B',
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
