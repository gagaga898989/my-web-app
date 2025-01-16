"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { useState } from "react";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const dtFmt = "YYYY-MM-DD";
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      const res = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setLikes(updatedPost.likes);
      } else {
        console.error("Failed to update likes:", await res.json());
      }
    } catch (error) {
      console.error("Error while liking the post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="border border-slate-400 p-3">
      <div className="flex items-center justify-between">
        <div>{dayjs(post.createdAt).format(dtFmt)}</div>
        {post.categories && post.categories.length > 0 && (
          <div className="flex space-x-1.5">
            {post.categories.map((category) => (
              <div
                key={category.id}
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "text-xs font-bold",
                  "border border-slate-400 text-slate-500"
                )}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <Link href={`/posts/${post.id}`}>
        <div className="mb-1 text-lg font-bold">{post.title}</div>
        <div
          className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </Link>
      <div className="mt-3 flex items-center space-x-3">
        <button
          onClick={handleLike}
          className={twMerge(
            "rounded-md px-3 py-1 text-sm font-bold",
            "border border-blue-400 text-blue-600",
            isLiking ? "bg-blue-200" : "bg-white"
          )}
          disabled={isLiking}
        >
          {isLiking ? "いいね中..." : "いいね"}
        </button>
        <div className="text-sm text-slate-600">いいね数: {likes}</div>
      </div>
    </div>
  );
};

export default PostSummary;
