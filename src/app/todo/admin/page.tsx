"use client";

import React, { useState } from "react";
import { Todo } from "@/app/_types/todo";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

interface AddTaskProps {
  onAdd: (todo: Todo) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [apiError, setApiError] = useState("");

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    const date = dt === "" ? null : dayjs(dt).toDate();
    if (date && !dayjs(dt).isValid()) {
      console.error("無効な日付形式");
      return;
    }
    setNewTodoDeadline(date);
  };

  const resetForm = () => {
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setNewTodoNameError("");
    setApiError("");
  };

  const addNewTodo = async () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }

    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };

    try {
      const response = await fetch("/api/todo/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("タスク追加のAPIエラー");
      }

      onAdd(newTodo);
      resetForm();
    } catch (error) {
      setApiError("タスクの追加に失敗しました。再試行してください。");
      console.error("タスク追加に失敗しました:", error);
    }
  };

  return (
    <div className="mt-5 space-y-3 rounded-md border p-4">
      <h2 className="text-lg font-bold">新しいタスクの追加</h2>

      <div>
        <div className="flex items-center space-x-2">
          <label className="font-bold" htmlFor="newTodoName">
            名前
          </label>
          <input
            id="newTodoName"
            type="text"
            value={newTodoName}
            onChange={updateNewTodoName}
            className={twMerge(
              "grow rounded-md border p-2",
              newTodoNameError && "border-red-500 outline-red-500"
            )}
            placeholder="2文字以上、32文字以内で入力してください"
          />
        </div>
        {newTodoNameError && (
          <div className="text-sm font-bold text-red-500">
            {newTodoNameError}
          </div>
        )}
      </div>

      <div className="flex gap-5">
        <div className="font-bold">優先度</div>
        {[1, 2, 3].map((value) => (
          <label key={value} className="flex items-center space-x-1">
            <input
              name="priorityGroup"
              type="radio"
              value={value}
              checked={newTodoPriority === value}
              onChange={updateNewTodoPriority}
            />
            <span>{value}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-x-2">
        <label htmlFor="deadline" className="font-bold">
          期限
        </label>
        <input
          type="datetime-local"
          id="deadline"
          value={
            newTodoDeadline
              ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
              : ""
          }
          onChange={updateDeadline}
          className="rounded-md border px-2 py-1"
        />
      </div>

      <button
        type="button"
        onClick={addNewTodo}
        className={twMerge(
          "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
          newTodoNameError && "cursor-not-allowed opacity-50"
        )}
        disabled={!!newTodoNameError} // エラーがあれば無効化
      >
        追加
      </button>

      {apiError && (
        <div className="mt-2 text-sm font-bold text-red-500">{apiError}</div>
      )}
    </div>
  );
};

export default AddTask;
