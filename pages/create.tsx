import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import {
  NFT,
  ChainId,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useMetamask } from "@thirdweb-dev/react";

type Props = {};

function Create({}: Props) {
  const connectWithMetamask = useMetamask();

  const address = useAddress();

  const rout = useRouter();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const [selectNft, setSelectNft] = useState<NFT>();

  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTACT,
    "nft-collection"
  );

  const ownedNfts = useOwnedNFTs(collectionContract, address);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(contract);

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTACT!,
          tokenId: selectNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7 * 53, //1year
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS: ", data, variables, context);
            rout.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR:", error, variables, context);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTACT!,
          tokenId: selectNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS:", data, variables, context);
            rout.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR:", error, variables, context);
          },
        }
      );
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you would like to Sell
        </h2>
        <hr className="mb-5" />
        {address ? (
          <p>Below you will find the NFTs in which you own in your wallet</p>
        ) : (
          <div className="text-center py-5">
            <p>You are not Loged in please connect your Wallet</p>
            <p>in order to list Items and mint your NFTs</p>
            <button
              onClick={connectWithMetamask}
              className="bg-blue-500 p-2 rounded-lg mt-6 text-white font-semibold shadow-lg active:bg-white active:text-blue-500"
            >
              {" "}
              Connect your wallet
            </button>
          </div>
        )}

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNfts?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              onClick={() => setSelectNft(nft)}
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${
                nft.metadata.id === selectNft?.metadata.id
                  ? "border-black scale-105 shadow-md"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="text-2xl font-semibold ">{nft.metadata.name}</p>
              <p className="">{nft.metadata.description}</p>
            </div>
          ))}
        </div>
        {selectNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex justify-center flex-col p-10">
              <div className=" grid grid-cols-2 p-10 gap-5">
                <label className="border-r font-light" htmlFor="">
                  Direct Listing / Fixed Price
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="directListing"
                />

                <label className="border-r font-light" htmlFor="">
                  Auction
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                />

                <label className="border-r font-light" htmlFor="">
                  Price:
                </label>
                <input
                  className="bg-gray-100 p-5 rounded-lg"
                  name="price"
                  type="text"
                  placeholder="0.05"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 p-3 text-white font-semibold rounded-2xl mt-8 shadow-lg boder hover:bg-white hover:text-blue-500 active:text-white active:bg-blue-400"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default Create;
