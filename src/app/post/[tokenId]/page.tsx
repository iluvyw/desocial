import { contractAddress } from "@/config/address";
import { ethers } from "ethers";
import ABI from "@/abi/desocial.json";
import Image from "next/image";
import { ipfsToHttps, truncateAddress } from "@/utils";

async function getPost(tokenId: string) {
  const provider = new ethers.JsonRpcProvider(
    "https://endpoints.omniatech.io/v1/eth/sepolia/public"
  );
  const contract = new ethers.Contract(contractAddress, ABI, provider);

  const tokenURI = await contract.tokenURI(tokenId);

  const author = await contract.ownerOf(tokenId);

  const metadata = await fetch(tokenURI);
  const metadataJson = await metadata.json();

  return { ...metadataJson, author };
}

export default async function Post({
  params,
}: {
  params: { tokenId: string };
}) {
  const post = await getPost(params.tokenId);

  return (
    <div className="flex flex-row justify-center w-2/3 my-auto">
      <div className="relative w-[600px] h-[600px]">
        <Image
          src={ipfsToHttps(post.image)}
          alt="thumbnail"
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="w-1/2 flex flex-col ml-4">
        <h1 className="text-3xl font-bold">{post.name}</h1>
        <h2>By {truncateAddress(post.author)}</h2>
        <p>{post.description}</p>
      </div>
    </div>
  );
}
