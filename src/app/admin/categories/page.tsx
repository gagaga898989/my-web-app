"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("カテゴリの取得に失敗しました");
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/admin/categories/${id}`);
  };

  const handleDelete = (id: string) => {
    router.push(`/admin/categories/${id}`);
  };

  const handleCreate = () => {
    router.push("/admin/categories/new");
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
        <h1 style={{ textAlign: "center" }}>カテゴリ一覧</h1>
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
      {categories.length === 0 ? (
        <p style={{ textAlign: "center" }}>カテゴリがありません。</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                border: "1px solid black",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                textAlign: "center",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>{category.name}</h2>
              <p style={{ fontSize: "12px", color: "gray" }}>
                {new Date(category.createdAt).toLocaleString()}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => handleEdit(category.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ffc107",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
