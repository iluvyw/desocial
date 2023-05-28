"use client";

import { useMetaMask } from "@/hooks/useMetaMask";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import storage from "@/firebase/storage";
import { ethers } from "ethers";
import ABI from "@/abi/desocial.json";
import { contractAddress } from "@/config/address";
import { v4 as uuidv4 } from "uuid";

export default function Create() {
  const { wallet, finishConnecting } = useMetaMask();
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState<{ active: boolean; msg: string }>({
    active: false,
    msg: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !nameRef.current?.value || !descriptionRef.current?.value) {
      alert("Empty input");
      return;
    }
    if (wallet.chainId !== "0xaa36a7") {
      alert("Please switch to Sepolia Testnet");
      return;
    }
    try {
      setLoading({ active: true, msg: "Uploading metadata..." });
      const fileExtension = file.name.split(".").pop;
      const uuid = uuidv4();
      const storageRef = ref(storage, `/image/${uuid}.${fileExtension}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      const data = {
        name: nameRef.current?.value,
        description: descriptionRef.current?.value,
        image: imageUrl,
      };
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: "application/json" });
      const jsonRef = ref(storage, `/json/${uuid}.json`);
      await uploadBytes(jsonRef, blob);
      const fileUrl = await getDownloadURL(jsonRef);
      setLoading({ active: true, msg: "Minting..." });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(wallet.accounts[0]);
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const txResponse = await contract.safeMint(fileUrl);
      await txResponse.wait(1);
    } catch (error) {
      alert("Error");
      console.log(error);
    } finally {
      setLoading({ active: false, msg: "" });
    }
  };

  useEffect(() => {
    finishConnecting && !wallet.accounts[0] && router.replace("/");
  }, [finishConnecting, wallet, router]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="h-full bg-white flex flex-col justify-center w-[500px]"
    >
      <label
        htmlFor="file-upload"
        className="relative h-[500px] w-full border border-black flex flex-col items-center justify-center mb-4"
      >
        {!file ? (
          "Choose Your Image"
        ) : (
          <Image
            src={URL.createObjectURL(file)}
            alt="preview"
            fill={true}
            style={{ objectFit: "contain" }}
          />
        )}
      </label>
      <input
        className="hidden"
        type="file"
        id="file-upload"
        accept="image/png, image/gif, image/jpeg"
        onChange={(e) =>
          setFile(e.target.files ? e.target.files[0] : undefined)
        }
      />
      <label className="mb-2">Name</label>
      <input
        ref={nameRef}
        type="text"
        className="border border-black w-full p-2 outline-none mb-4"
      />
      <label className="mb-2">Description</label>
      <textarea
        ref={descriptionRef}
        rows={5}
        className="resize-none border border-black w-full p-2 outline-none mb-4"
      />
      <button className="mt-auto w-full py-4 bg-black text-white" type="submit">
        {loading.active ? loading.msg : "Submit"}
      </button>
    </form>
  );
}
