"use client";

import { useMetaMask } from "@/hooks/useMetaMask";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlinePlus, AiOutlineArrowLeft } from "react-icons/ai";

export default function Navigator() {
  const { wallet } = useMetaMask();
  const pathname = usePathname();

  if (!wallet.accounts[0]) return null;
  return (
    <Link
      className={`fixed bottom-10 ${
        pathname === "/" ? "right-10" : "left-10"
      } rounded-full border border-black text-xl p-4 bg-white`}
      href={pathname === "/" ? "/create" : "/"}
    >
      {pathname === "/" ? <AiOutlinePlus /> : <AiOutlineArrowLeft />}
    </Link>
  );
}
