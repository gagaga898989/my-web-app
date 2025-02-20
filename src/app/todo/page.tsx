"use client";

import React, { useEffect, useState } from "react";
import { Todo } from "@/app/_types/todo";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [apiError, setApiError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ユーザー情報を取得
  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const user = data?.user;
      if (user) {
        setIsLoggedIn(true);
        setUsername(user.user_metadata?.displayname || "ゲスト");
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    } catch (error) {
      console.error("ユーザー情報の取得に失敗:", error);
      setApiError("ログイン情報の取得に失敗しました。");
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  // Todo一覧を取得
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todo", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" }, // キャッシュ無効化
      });
      if (!response.ok) throw new Error("タスク取得APIエラー");

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("タスク取得に失敗:", error);
      setApiError("タスクの取得に失敗しました。再試行してください。");
    }
  };

  // Todoの完了状態を更新
  const updateIsDone = async (id: string, isDone: boolean) => {
    try {
      const response = await fetch("/api/todo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDone }),
      });

      if (!response.ok) throw new Error("タスク更新APIエラー");

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
        )
      );
    } catch (error) {
      console.error("タスク更新に失敗:", error);
      setApiError("タスクの更新に失敗しました。再試行してください。");
    }
  };

  // Todoを削除
  const removeTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todo/admin?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("タスク削除APIエラー");

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("タスク削除に失敗:", error);
      setApiError("タスクの削除に失敗しました。再試行してください。");
    }
  };

  // ログアウト
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setIsLoggedIn(false);
      setUsername("");
    } catch (error) {
      console.error("ログアウトに失敗:", error);
      setApiError("ログアウトに失敗しました。再試行してください。");
    }
  };

  // 初期化処理
  useEffect(() => {
    const initialize = async () => {
      await fetchUser(); // ユーザー情報取得
      await fetchTodos(); // タスク取得

      // Supabaseのリアルタイムリスニング
      const channel = supabase
        .channel("todos")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "todos" },
          (payload) => {
            console.log("リアルタイム更新:", payload);
            fetchTodos(); // データを再取得
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initialize();
  }, []);

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
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
          >
            ログアウト
          </button>
        ) : (
          <button className="rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600">
            <Link href="/login">ログイン</Link>
          </button>
        )}
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
              onClick={() => removeTodo(todo.id)}
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
