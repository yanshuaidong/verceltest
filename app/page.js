"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("正在查询数据库...");
  const [isSaving, setIsSaving] = useState(false);

  async function loadProfile() {
    setStatus("正在查询数据库...");
    const response = await fetch("/api/profile", { cache: "no-store" });
    const data = await response.json();

    setProfile(data.profile);
    setName(data.profile?.name || "");
    setBio(data.profile?.bio || "");
    setStatus("查询完成");
  }

  async function updateProfile(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("正在修改数据库...");

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, bio })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "修改失败");
      setIsSaving(false);
      return;
    }

    setProfile(data.profile);
    setStatus("修改完成，页面数据已刷新");
    setIsSaving(false);
  }

  useEffect(() => {
    loadProfile().catch(() => {
      setStatus("查询失败，请确认数据库已初始化");
    });
  }, []);

  return (
    <main className={styles.shell}>
      <section className={styles.header}>
        <p className={styles.kicker}>Next.js + Vercel API + Prisma</p>
        <h1>一个最小的全栈数据库示例</h1>
        <p>
          这个页面展示两个动作：从数据库查询资料，并把表单内容写回数据库。
        </p>
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            <h2>查询结果</h2>
            <button type="button" onClick={loadProfile}>
              重新查询
            </button>
          </div>

          <dl className={styles.result}>
            <div>
              <dt>ID</dt>
              <dd>{profile?.id ?? "-"}</dd>
            </div>
            <div>
              <dt>名称</dt>
              <dd>{profile?.name ?? "-"}</dd>
            </div>
            <div>
              <dt>简介</dt>
              <dd>{profile?.bio ?? "-"}</dd>
            </div>
            <div>
              <dt>更新时间</dt>
              <dd>
                {profile?.updatedAt
                  ? new Date(profile.updatedAt).toLocaleString()
                  : "-"}
              </dd>
            </div>
          </dl>
        </div>

        <form className={styles.panel} onSubmit={updateProfile}>
          <h2>修改数据库</h2>

          <label className={styles.field}>
            名称
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>

          <label className={styles.field}>
            简介
            <input value={bio} onChange={(event) => setBio(event.target.value)} />
          </label>

          <button className={styles.primaryButton} type="submit" disabled={isSaving}>
            {isSaving ? "保存中..." : "保存修改"}
          </button>
        </form>
      </section>

      <p className={styles.status}>{status}</p>
    </main>
  );
}
