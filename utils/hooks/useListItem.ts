import {
    useAddress,
    useContract,
    useNetwork,
    useNetworkMismatch,
    useOwnedNFTs,
    useCreateAuctionListing,
    useCreateDirectListing,
    useMetamask,
    useActiveListings
  } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, NFT } from "@thirdweb-dev/sdk";
import React, {useState} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

import network from "../network";

const useListItem = () => {
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const rout = useRouter();
    const [selectNft, setSelectNft] = useState<NFT>();
    const [listingTypeCheck, setListingType] = React.useState<
      "directListing" | "auctionListing" | null
    >(null);
    const [priceCheck, setPrice] = React.useState<string>("");
  
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } = useActiveListings(contract);
  const { contract: collectionContract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTACT,
    "nft-collection"
  );

  const ownedNfts = useOwnedNFTs(collectionContract, address);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const { mutate: createDirectListing, isLoading: isLoadingCreate } =
    useCreateDirectListing(contract);

  const { mutate: createAuctionListing, isLoading: isLoadingAuction } =
    useCreateAuctionListing(contract);

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectNft) return;
    if (!listingTypeCheck) return toast.error("Please select a listing type");
    if (!priceCheck) return toast.error("Please enter a price");

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      toast.loading("Creating direct listing...");
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
          onSuccess() {
            toast.dismiss();
            toast.success("Direct listing created");
            rout.push("/");
          },
          onError(error, variables, context) {
            toast.dismiss();
            toast.error("Failed to create direct listing");
            setListingType(null);
            console.log("ERROR:", error, variables, context);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      toast.loading("Creating auction listing...");
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
          onSuccess() {
            toast.dismiss();
            toast.success("Auction listing created");
            rout.push("/");
          },
          onError(error, variables, context) {
            toast.dismiss();
            toast.error("Failed to create auction listing");
            setListingType(null);
            console.log("ERROR:", error, variables, context);
          },
        }
      );
    }
  };

    return {
        listings,
        loadingListings,
        address, 
        isLoading,
        connectWithMetamask,
        ownedNfts,
        setSelectNft,
        selectNft,
        handleCreateListing,
        setListingType,
        isLoadingAuction,
        isLoadingCreate,
        setPrice
    };
};

export default useListItem;
