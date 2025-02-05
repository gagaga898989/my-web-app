"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MainPage() {
  const router = useRouter();

  const navigateToBlog = () => {
    router.push("/blog");
  };

  const navigateToTodo = () => {
    router.push("/todo");
  };

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <h1>メインページ</h1>
      <div style={{ marginTop: "20px" }}>
        {/* Linkを使ったバージョン */}
        <Link href="/blog">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            ブログへ
          </button>
        </Link>

        <Link href="/todo">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#28A745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Todoアプリへ
          </button>
        </Link>
      </div>
    </main>
  );
}
