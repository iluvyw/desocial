import { ipfsToHttps, truncateAddress } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export default function Post({
  metadata,
  tokenId,
}: {
  metadata: any;
  tokenId: number;
}) {
  return (
    <Link href={`/post/${tokenId}/`}>
      <div className="border border-black w-full h-[600px] p-[50px] mb-10">
        <div className="relative w-full h-[400px]">
          <Image
            src={ipfsToHttps(metadata.image)}
            alt="hello"
            loading="lazy"
            style={{ objectFit: "cover" }}
            fill={true}
          />
        </div>
        <h1 className="font-bold text-3xl my-6">{metadata.name}</h1>
        <h2>By {truncateAddress(metadata.author)}</h2>
        {/* <p className="line-clamp-3">{metadata.description}</p> */}
      </div>
    </Link>
  );
}
