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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-green-500 text-white">
      <h1 className="mb-8 text-4xl font-bold">メインページ</h1>
      <div className="space-x-4">
        {/* Linkを使ったバージョン */}
        <Link href="/blog">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700">
            ブログへ
          </button>
        </Link>

        <Link href="/todo">
          <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-green-700">
            Todoアプリへ
          </button>
        </Link>
      </div>
    </main>
  );
}
