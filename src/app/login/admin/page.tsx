"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayname, setDisplayname] = useState(""); // Display nameの状態管理
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayname }), // displaynameを追加
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login"); // 成功時にリダイレクト
      } else {
        setError(data.error || "登録に失敗しました。もう一度試してください。");
      }
    } catch (err) {
      setError(
        "予期しないエラーが発生しました。ネットワークの状態をご確認ください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded border p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">新規ユーザー登録</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded border p-2"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="rounded border p-2"
        />
        <input
          type="text"
          placeholder="表示名"
          value={displayname}
          onChange={(e) => setDisplayname(e.target.value)}
          required
          className="rounded border p-2"
        />
        <button
          type="submit"
          className={`rounded p-2 text-white ${loading ? "bg-gray-500" : "bg-blue-500"}`}
          disabled={loading}
        >
          {loading ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
