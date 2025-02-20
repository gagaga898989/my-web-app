"use client";

import React, { useEffect, useState } from "react";
import { Todo } from "@/app/_types/todo";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [apiError, setApiError] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // ユーザーネームの状態管理
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // ログイン状態を管理

  // ログインユーザーの情報を取得
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
      setIsLoggedIn(false);
      return;
    }

    const user = data?.user;
    if (user) {
      setIsLoggedIn(true);
      if (user.user_metadata && user.user_metadata.displayname) {
        setUsername(user.user_metadata.displayname); // displaynameを状態にセット
      }
    } else {
      setIsLoggedIn(false);
      setUsername(""); // ゲストモードの場合
    }
  };

  // Todo一覧を取得
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todo");
      if (!response.ok) {
        throw new Error("タスク取得のAPIエラー");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      setApiError("タスクの取得に失敗しました。再試行してください。");
      console.error("タスク取得に失敗しました:", error);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトに失敗しました:", error);
      return;
    }
    setIsLoggedIn(false);
    setUsername("");
  };

  useEffect(() => {
    fetchUser(); // ユーザー情報を取得
    fetchTodos();
  }, []);

  // Todoの完了状態を更新
  const updateIsDone = async (id: string, isDone: boolean) => {
    try {
      const response = await fetch("/api/todo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDone }),
      });

      if (!response.ok) {
        throw new Error("タスク更新のAPIエラー");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
        )
      );
    } catch (error) {
      console.error("タスクの更新に失敗しました:", error);
    }
  };

  // Todoを削除
  const remove = async (id: string) => {
    try {
      const response = await fetch(`/api/todo/admin?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("タスク削除のAPIエラー");
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("タスクの削除に失敗しました:", error);
    }
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      {username ? (
        <div className="text-green-500">こんにちは、{username} さん！</div>
      ) : (
        <div className="text-red-500">
          ゲストモードでブラウジング中です。変更が保存されません。
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        {isLoggedIn ? (
          // ログインしている場合はログアウトボタンを表示
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
          >
            ログアウト
          </button>
        ) : (
          // ログインしていない場合はログインボタンを表示
          <button className="rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600">
            <Link href="/login">ログイン</Link>
          </button>
        )}
        {/* 新規作成ボタン */}
        <button className="rounded-md bg-green-500 px-3 py-1 font-bold text-white hover:bg-green-600">
          <Link href="/todo/admin">新規作成</Link>
        </button>
      </div>
      {apiError && <div className="text-red-500">{apiError}</div>}
      <div>
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2 border p-2">
            <span className={todo.isDone ? "text-gray-500 line-through" : ""}>
              {todo.name}
              重要度: {todo.priority}
              期限:
              {todo.deadline
                ? new Date(todo.deadline).toLocaleString()
                : "設定なし"}
            </span>
            <button
              onClick={() => updateIsDone(todo.id, todo.isDone)}
              className="ml-auto rounded bg-green-500 px-2 py-1 text-white"
            >
              {todo.isDone ? "未完了にする" : "完了"}
            </button>
            <button
              onClick={() => remove(todo.id)}
              className="rounded bg-red-500 px-2 py-1 text-white"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
