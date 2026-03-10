CREATE TABLE IF NOT EXISTS media (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  url             TEXT NOT NULL,
  type            TEXT,
  size            INTEGER,
  tags            TEXT,
  description     TEXT,
  alt_text        TEXT,
  category        TEXT,
  mood            TEXT,
  focus_point_x   INTEGER DEFAULT 50,
  focus_point_y   INTEGER DEFAULT 50,
  uploaded_by     UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
