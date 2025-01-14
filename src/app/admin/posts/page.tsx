"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostSummary from "@/app/_components/PostSummary";
import type { Post } from "@/app/_types/Post";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("記事の取得に失敗しました");
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/admin/posts/${id}`);
  };

  const handleDelete = (id: string) => {
    // 削除処理を追加
    if (confirm("本当に削除しますか？")) {
      fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("削除に失敗しました");
          }
          setPosts(posts.filter((post) => post.id !== id));
        })
        .catch((err) => {
          setError(err.message || "エラーが発生しました");
        });
    }
  };

  const handleCreate = () => {
    router.push("/admin/posts/new");
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

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
        <h1 style={{ textAlign: "center" }}>投稿記事一覧</h1>
        <button
          onClick={handleCreate}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          新規作成
        </button>
      </header>
      {posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>投稿記事がありません。</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              <PostSummary post={post} />
              <div style={{ marginTop: "10px", textAlign: "right" }}>
                <button
                  onClick={() => handleEdit(post.id)}
                  style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    backgroundColor: "#28A745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#DC3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
