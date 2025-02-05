"use client";

import React, { useEffect, useState } from "react";
import { Todo } from "@/app/_types/todo";
import Link from "next/link";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [apiError, setApiError] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // Add username state
  const [uncompletedCount, setUncompletedCount] = useState<number>(0); // Add uncompletedCount state
  const [showUser, setShowUser] = useState<boolean>(false); // Add showUser state
  const [showFireOrbit, setShowFireOrbit] = useState<boolean>(false); // Add showFireOrbit state

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/getTodos");
      if (!response.ok) {
        throw new Error("タスク取得のAPIエラー");
      }
      const data = await response.json();
      setTodos(data);
      setUncompletedCount(data.filter((todo: Todo) => !todo.isDone).length); // Calculate uncompleted todos
    } catch (error) {
      setApiError("タスクの取得に失敗しました。再試行してください。");
      console.error("タスク取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const updateIsDone = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  const remove = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const removeCompletedTodos = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.isDone));
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4 flex items-center justify-between">
        <button className="rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600">
          <Link href="/login">ログイン</Link>
        </button>
      </div>
      {username === "" && (
        <div className="text-red-500">
          gestmodeでブラウジング中 変更が保存されません。
        </div>
      )}
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>
            <p>botan</p>
            <button onClick={() => updateIsDone(todo.id)}>完了/未完了</button>
            <button onClick={() => remove(todo.id)}>削除</button>
          </div>
        ))}
      </div>
      <div>
        <button
          type="button"
          className="rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
        >
          <Link href="/todo/admin">カテゴリ管理</Link>
        </button>
      </div>

      <button
        type="button"
        onClick={removeCompletedTodos}
        className="mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
      >
        完了済みのタスクを削除
      </button>

      <button
        type="button"
        onClick={() => setShowFireOrbit(true)}
        className="rounded-md bg-green-500 px-3 py-1 font-bold text-white hover:bg-green-600"
      >
        完了履歴
      </button>

      {showFireOrbit && (
        <div className="modal">
          <div className="modal-content">
            {/* <FireOrbit todos={todos} /> */}
            <button onClick={() => setShowFireOrbit(false)}>閉じる</button>
          </div>
        </div>
      )}
      {showUser && (
        <div className="modal">
          <div className="modal-content">
            {/* <User2 onLogin={handleLogin} /> */}
            <button onClick={() => setShowUser(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
