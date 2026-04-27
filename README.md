# Vercel Full-Stack Database Demo

这是一个用于学习 Vercel 全栈项目结构的最小示例：

- `app/page.js`：前端页面，负责查询和提交修改。
- `app/api/profile/route.js`：后端 API，负责读写数据库。
- `lib/db.js`：Supabase Postgres 连接、建表、查询、修改。
- `.env`：本地数据库连接字符串，不要提交到 Git。

## 本地运行

```bash
npm install
npm run db:seed
npm run dev
```

打开 http://localhost:3000。

如果本地网络不能直连 Supabase Postgres，可以打开 Supabase 项目的 SQL Editor，运行：

```sql
-- scripts/supabase-schema.sql
```

## Vercel 可以全栈完成吗？

可以。Vercel 可以运行前端页面，也可以运行后端 API/Server Actions。

部署到 Vercel 时，需要在项目的 Environment Variables 里添加同名变量：

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres"
```

这样 Vercel 的后端 API 就能连接 Supabase Postgres。

Supabase 部署到 Vercel 时更推荐使用 Transaction pooler 连接串，例如：

```bash
DATABASE_URL="postgresql://postgres.your-project-ref:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
```
