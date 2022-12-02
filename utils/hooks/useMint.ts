import { useAddress, useContract } from "@thirdweb-dev/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const useMint = () => {
  const rout = useRouter();
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTACT,
    "nft-collection"
  );
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !address) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!image) {
      return toast.error("Please upload an image");
    }
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };
    if (!target.name.value) {
      toast.error("Please enter a name");
      return;
    }
    if (!target.description.value) {
      toast.error("Please enter a description");
      return;
    }
    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };
    setIsLoading(true);
    toast.loading("Minting/Adding NFT...");
    try {
      const tx = await contract.mintTo(address, metadata);
      const receipt = tx.receipt; //the transition receipt
      if (!receipt) return;
      toast.dismiss();
      toast.success("Successfully minted NFT");
      setIsLoading(false);
      rout.push("/");
    } catch (err) {
      toast.dismiss();
      toast.error("Error minting NFT");
      setIsLoading(false);
      console.error(err);
    }
  };

  return {
    address,
    image,
    setImage,
    isLoading,
    setIsLoading,
    preview,
    setPreview,
    mintNft,
  };
};

export default useMint;
