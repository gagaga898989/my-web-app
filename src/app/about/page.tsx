"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  return (
    <main>
      <div className="mb-5 text-2xl font-bold">About</div>

      <div
        className={twMerge(
          "mx-auto mb-5 w-full md:w-2/3",
          "flex justify-center"
        )}
      >
        <Image
          src="/images/avatar.png"
          alt="Example Image"
          width={350}
          height={350}
          priority
          className="rounded-full border-4 border-slate-500 p-1.5"
        />
      </div>
      <button
        onClick={() => alert("設定ボタンがクリックされました")}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "skyblue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        設定
      </button>
    </main>
  );
};

export default Page;
