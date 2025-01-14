"use client";

import Link from "next/link";

export default function AdminLinksPage() {
  return (
    <main style={{ padding: "20px" }}>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>管理者リンク一覧</h1>
      </header>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "10px" }}>
          <Link
            href="/admin/posts"
            style={{
              display: "block",
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              borderRadius: "5px",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            投稿記事管理
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link
            href="/admin/categories"
            style={{
              display: "block",
              padding: "10px 20px",
              backgroundColor: "#28A745",
              color: "white",
              borderRadius: "5px",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            カテゴリ管理
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link
            href="/admin/users"
            style={{
              display: "block",
              padding: "10px 20px",
              backgroundColor: "#DC3545",
              color: "white",
              borderRadius: "5px",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            ユーザー管理
          </Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link
            href="/admin/settings"
            style={{
              display: "block",
              padding: "10px 20px",
              backgroundColor: "#FFC107",
              color: "white",
              borderRadius: "5px",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            設定
          </Link>
        </li>
      </ul>
    </main>
  );
}
