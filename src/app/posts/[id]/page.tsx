"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ◀ 注目

interface Post {
  id: string;
  title: string;
  content: string;
  coverImageURL: string;
  moveing : string;
  categories: { categoryId: string; category: { name: string } }[];
}

const PostDetail = () => {
  const { id } = useParams() as { id: string };

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "エラーが発生しました");
        }
        const data: Post = await response.json();
        setPost(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div className="mb-2 text-2xl font-bold">{post?.title}</div>
      <img
        src={post?.coverImageURL}
        alt={post?.title}
        style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
      />
      
      <div
        dangerouslySetInnerHTML={{ __html: post?.content || "" }}
        style={{ marginBottom: "20px" }}
      />
      <button
        onClick={() => window.history.back()} // 修正: onClick 属性を適切に設定
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "skyblue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        戻る
      </button>
    </div>
  );
};

export default PostDetail;
