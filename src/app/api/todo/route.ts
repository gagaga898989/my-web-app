import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Task } from "@prisma/client";

// Todo の一覧を取得
export const GET = async (req: NextRequest) => {
  try {
    const todos: Task[] = await prisma.task.findMany({
      orderBy: {
        priority: "asc", // 優先度の昇順で並べる
      },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Todo の一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
};
