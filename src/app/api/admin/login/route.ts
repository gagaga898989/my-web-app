import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアントの作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 必須項目が存在しない場合はエラーレスポンス
    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードは必須です。" },
        { status: 400 }
      );
    }

    // ユーザーを作成
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // これを追加するとメール確認済みとして登録される
      user_metadata: { role: "admin" },
    });

    // エラーが発生した場合
    if (error) {
      // 特定のエラータイプに応じたメッセージ
      if (error.message.includes("duplicate key value")) {
        return NextResponse.json(
          { error: "そのメールアドレスはすでに使用されています。" },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 成功時にはユーザー情報を返す
    return NextResponse.json({ user: data }, { status: 201 });
  } catch (error) {
    console.error(error); // サーバーサイドでのエラーはログとして残す
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
