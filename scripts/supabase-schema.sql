CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO profiles (id, name, bio, updated_at)
VALUES (
  1,
  'Vercel Learner',
  '这是 Supabase Postgres 中的第一条资料。你可以在页面上查询并修改它。',
  now()
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  bio = excluded.bio,
  updated_at = now();
