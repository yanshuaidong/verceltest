import pg from "pg";

const globalForDb = globalThis;
const { Pool } = pg;

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export function getDb() {
  if (!globalForDb.vercelDemoPool) {
    globalForDb.vercelDemoPool = createPool();
  }

  return globalForDb.vercelDemoPool;
}

export async function ensureSchema() {
  const db = getDb();

  await db.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      bio TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

export async function getProfile() {
  const db = getDb();
  await ensureSchema();

  const result = await db.query(
    `
      SELECT
        id,
        name,
        bio,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM profiles
      WHERE id = $1
    `
    ,
    [1]
  );

  let profile = result.rows[0];

  if (!profile) {
    profile = await updateProfile({
      name: "Vercel Learner",
      bio: "这是数据库中的第一条资料。你可以在页面上查询并修改它。"
    });
  }

  return profile;
}

export async function updateProfile({ name, bio }) {
  const db = getDb();
  await ensureSchema();

  const result = await db.query(
    `
    INSERT INTO profiles (id, name, bio, updated_at)
    VALUES ($1, $2, $3, now())
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      bio = excluded.bio,
      updated_at = now()
    RETURNING
      id,
      name,
      bio,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `,
    [1, name, bio]
  );

  return result.rows[0];
}
