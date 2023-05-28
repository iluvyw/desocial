import { ethers } from "ethers";
import ABI from "@/abi/desocial.json";
import Post from "./components/Post";
import { contractAddress } from "@/config/address";

export const revalidate = 60;

async function getPosts() {
  const provider = new ethers.JsonRpcProvider(
    "https://endpoints.omniatech.io/v1/eth/sepolia/public"
  );
  const contract = new ethers.Contract(contractAddress, ABI, provider);

  const totalSupply = await contract.totalSupply();

  const tokenURIs: string[] = [];
  const owners: string[] = [];
  for (let i = 0; i < parseInt(totalSupply); i++) {
    const tokenURI = await contract.tokenURI(i);
    const owner = await contract.ownerOf(i);
    tokenURIs.push(tokenURI);
    owners.push(owner);
  }

  const metadatas: any[] = [];
  for (let i = 0; i < tokenURIs.length; i++) {
    const metadata = await fetch(tokenURIs[i]);
    const metadataJson = await metadata.json();
    metadatas.push({ ...metadataJson, author: owners[i] });
  }
  return metadatas;
}

export default async function Home() {
  const metadatas = await getPosts();

  return (
    <div className="w-full h-auto min-h-full grid grid-cols-3 px-10 gap-4">
      {metadatas.length === 0 && "Empty feed"}
      {metadatas.map((metadata, index) => (
        <Post key={index} metadata={metadata} tokenId={index} />
      ))}
    </div>
  );
}
