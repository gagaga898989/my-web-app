"use client";

import { useEffect, useState } from "react";
import PostSummary from "../_components/PostSummary";
import type { Post } from "@/app/_types/Post";

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        setError("投稿記事の取得に失敗しました");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main>
      <h1>記事一覧</h1>
      {posts.length === 0 ? (
        <p>記事がありません。</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <PostSummary post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default PostList;
