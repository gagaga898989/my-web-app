"use client";

import React, { useState } from "react";
import AddTask from "@/app/todo/admin/AddTask";
import { Todo } from "@/app/_types/todo";

const AdminPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAddTodo = (newTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">管理ページ</h1>
      <AddTask onAdd={handleAddTodo} />
      <div className="mt-5 space-y-3">
        {todos.map((todo) => (
          <div key={todo.id} className="rounded-md border p-3">
            <h2 className="text-lg font-bold">{todo.name}</h2>
            <p>優先度: {todo.priority}</p>
            <p>
              期限:{" "}
              {todo.deadline
                ? new Date(todo.deadline).toLocaleString()
                : "設定なし"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
