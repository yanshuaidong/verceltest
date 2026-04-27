const { Pool } = require("pg");

require("node:fs")
  .readFileSync(".env", "utf8")
  .split(/\r?\n/)
  .filter((line) => line && !line.startsWith("#"))
  .forEach((line) => {
    const index = line.indexOf("=");
    if (index === -1) return;

    const key = line.slice(0, index);
    const value = line.slice(index + 1).replace(/^"|"$/g, "");
    process.env[key] = process.env[key] || value;
  });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      bio TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await db.query(
    `
    INSERT INTO profiles (id, name, bio, updated_at)
    VALUES ($1, $2, $3, now())
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      bio = excluded.bio,
      updated_at = now()
  `,
    [
      1,
      "Vercel Learner",
      "这是 Supabase Postgres 中的第一条资料。你可以在页面上查询并修改它。"
    ]
  );

  console.log("Seeded Supabase Postgres database");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.end();
  });
