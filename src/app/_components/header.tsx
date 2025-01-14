"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faFish,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <div>
            <Link href="/">
              <FontAwesomeIcon icon={faFish} className="mr-1" />
              Header
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div>
              <Link href="/active">active</Link>
            </div>
            <div>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1" />
              検索
            </div>
            <div>
              <Link href="/about">About</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
