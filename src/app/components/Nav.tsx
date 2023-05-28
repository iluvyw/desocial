import Link from "next/link";
import ConnectButton from "./ConnectButton";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 backdrop-blur-xl z-50 border-b border-black flex flex-row items-center px-10">
      <Link href={"/"} className="font-bold text-2xl">
        Desocial.
      </Link>
      <ConnectButton />
    </nav>
  );
}
