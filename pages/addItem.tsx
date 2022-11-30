import React, { FormEvent, useState } from "react";
import { Header } from "../components";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import Head from "next/head";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { Ring } from "@uiball/loaders";

const addItem = () => {
  const rout = useRouter();
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTACT,
    "nft-collection"
  );
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mintItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !address) {
      toast.error("Please connect your wallet");
      return;
    }
    setIsLoading(true);
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

  return (
    <div>
      <Header />
      <Head>
        <title>Ebay Clone: Mint NFT</title>
        <link rel="icon" href="/ebay-icon.png" />
      </Head>
      <main className="max-w-6xl mx-auto p-10 border rounded-lg shadow-md my-10">
        <h1 className="text-4xl font-bold ">Add an Item to the Market place</h1>
        <h2 className="text-xl font-semibold pt-5">Item details</h2>
        <p className="pb-5">
          By adding an item to the marketplace, you are essentially Minting an
          Item of the item into your wallet which you can then list for Sell.
        </p>
        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5">
          <img
            className="object-contain border"
            width={400}
            height={400}
            src={preview || "/addItem.png"}
          />
          <form
            onSubmit={mintItem}
            className="flex flex-col flex-1 p-2 space-y-2 justify-center"
            action=""
          >
            <label className="front-light" htmlFor="">
              Name of item
            </label>
            <input
              className="formFill"
              placeholder="Name of item..."
              type="text"
              name="name"
              id="name"
            />
            <label htmlFor="">Description</label>
            <input
              className="formFill"
              placeholder="Enter the description.."
              type="text"
              name="description"
              id="description"
            />
            <label htmlFor="">Image of the Item</label>
            <input
              type="file"
              onChange={(e: any) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
              name=""
              id=""
            />
            <button
              type="submit"
              className="mx-auto bg-blue-500 font-bold w-56 px-2 py-2 rounded-2xl shadow-xl border text-white hover:bg-white hover:text-blue-500 md:ml-auto "
            >
              {isLoading ? (
                <div className="flex flex-col justify-center items-center">
                  <Ring
                    size={20}
                    lineWeight={5}
                    speed={2}
                    color={"rgb(34 197 94)"}
                  />
                </div>
              ) : (
                <p>Add Item</p>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default addItem;
