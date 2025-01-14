"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// 記事データ型
type PostApiResponse = {
  id: string;
  title: string;
  content: string;
  coverImageURL: string;
  categories: { id: string; name: string }[];
};

const EditPage: React.FC = () => {
  const [post, setPost] = useState<PostApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [categories, setCategories] = useState<
    { id: string; isSelect: boolean; name: string }[]
  >([]);

  const router = useRouter();
  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        const data: PostApiResponse = await res.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setCoverImageURL(data.coverImageURL);
        setCategories(
          (data.categories || []).map((c) => ({
            id: c.id,
            isSelect: true,
            name: c.name,
          }))
        );
        //カテゴリ選択肢ようにカテゴリを全て取得
        const resCategories = await fetch("/api/categories");
        if (!resCategories.ok) {
          throw new Error(
            `${resCategories.status}: ${resCategories.statusText}`
          );
        }
        const dataCategories = await resCategories.json();
        setCategories(dataCategories);
      } catch (error) {
        setFetchErrorMsg(
          error instanceof Error
            ? `記事の取得に失敗しました: ${error.message}`
            : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const switchCategoryState = (categoryId: string) => {
    const requestUrl = "/api/categories";
    setCategories(
      categories.map((c) =>
        c.id === categoryId ? { ...c, isSelect: !c.isSelect } : c
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestBody = {
        title,
        content,
        coverImageURL,
        categoryIds: categories.filter((c) => c.isSelect).map((c) => c.id),
      };

      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      router.push(`/posts/${id}`);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `記事の更新に失敗しました: ${error.message}`
          : `予期せぬエラーが発生しました: ${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchErrorMsg) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  return (
    <main className="mx-auto mt-10 w-full max-w-full rounded-md bg-white p-6 shadow-md sm:max-w-lg lg:max-w-4xl xl:max-w-6xl">
      <div className="mb-4 text-2xl font-bold">記事の編集</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="block font-bold">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            className="w-full rounded-md border-2 px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="content" className="block font-bold">
            本文
          </label>
          <textarea
            id="content"
            className="h-48 w-full rounded-md border-2 px-2 py-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="coverImageURL" className="block font-bold">
            カバー画像URL
          </label>
          <input
            type="url"
            id="coverImageURL"
            className="w-full rounded-md border-2 px-2 py-1"
            value={coverImageURL}
            onChange={(e) => setCoverImageURL(e.target.value)}
          />
          {coverImageURL && (
            <img
              src={coverImageURL}
              alt="カバー画像プレビュー"
              className="mt-2 max-h-40 rounded border"
            />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-bold">タグ</div>
          <div className="flex flex-wrap gap-x-3.5">
            {categories.length > 0 ? (
              categories.map((c) => (
                <label key={c.id} className="flex space-x-1">
                  <input
                    id={c.id}
                    type="checkbox"
                    checked={c.isSelect}
                    className="mt-0.5 cursor-pointer"
                    onChange={() => switchCategoryState(c.id)}
                  />
                  <span className="cursor-pointer">{c.name}</span>
                </label>
              ))
            ) : (
              <div>選択可能なカテゴリが存在しません。</div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={`rounded-md bg-indigo-500 px-5 py-1 font-bold text-white hover:bg-indigo-600 ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
          ) : null}
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </form>
    </main>
  );
};

export default EditPage;
