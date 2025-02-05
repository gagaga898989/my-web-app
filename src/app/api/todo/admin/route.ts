
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Task } from "@prisma/client";

export const revalidate = 0; // サーバサイドのキャッシュを無効化する設定

// Task作成リクエストの型定義
type CreateTaskRequestBody = {
  name: string;
  isDone: boolean;
  priority: number;
  deadline: string | null; // ISO8601形式の文字列
};

// **POST: タスクを作成**
export const POST = async (req: NextRequest) => {
  try {
    const requestBody: CreateTaskRequestBody = await req.json();

    // 分割代入
    const { name, isDone, priority, deadline } = requestBody;

    // バリデーション
    if (!name || name.length < 2 || name.length > 32) {
      return NextResponse.json(
        { error: "タスク名は2文字以上32文字以内で指定してください" },
        { status: 400 }
      );
    }
    if (priority < 1 || priority > 3) {
      return NextResponse.json(
        { error: "優先度は1から3の間で指定してください" },
        { status: 400 }
      );
    }

    // タスクをデータベースに追加
    const task: Task = await prisma.task.create({
      data: {
        name,
        isDone,
        priority,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "タスクの作成に失敗しました" },
      { status: 500 }
    );
  }
};

// **DELETE: タスクを削除**
export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("id");

    // IDが提供されていない場合はエラーを返す
    if (!taskId) {
      return NextResponse.json(
        { error: "タスクIDが指定されていません" },
        { status: 400 }
      );
    }

    // タスクを削除
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "タスクの削除に失敗しました" },
      { status: 500 }
    );
  }
};
