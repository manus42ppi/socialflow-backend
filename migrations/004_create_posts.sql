CREATE TABLE IF NOT EXISTS posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT,
  content        TEXT,
  hashtags       TEXT,
  channels       TEXT[] DEFAULT '{}',
  status         TEXT DEFAULT 'draft',
  scheduled_date DATE,
  scheduled_time TIME,
  media_id       UUID REFERENCES media(id) ON DELETE SET NULL,
  campaign_id    UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_by     UUID REFERENCES users(id),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
