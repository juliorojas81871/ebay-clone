import {
  useContract,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  MediaRenderer,
  useAddress,
  useListing,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import Head from "next/head";

const ListingPage = () => {
  const rout = useRouter();
  const address = useAddress();
  const { listingId } = rout.query as { listingId: string };

  const [bidamount, setBidAmount] = useState("");
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  //a piece of state that is going to  tract the bidvalue
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  //get the marketplace
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listing, isLoading, error } = useListing(contract, listingId);

  const {
    mutate: acceptOffer,
    isLoading: acceptofferIsLoading,
    error: errorAcceptingOffer,
  } = useAcceptDirectListingOffer(contract);

  //bringing the offers to screen
  const offers = useOffers(contract, listingId);
  //make bid
  const { mutate: makeBid } = useMakeBid(contract);
  //buy now functionality
  const { mutate: buyNow } = useBuyNow(contract);

  const { mutate: makeOffer } = useMakeOffer(contract);

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listingId, listing, contract]);

  const fetchMinNextBid = async () => {
    if (!listing || !contract) return;

    const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
      listingId
    );

    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatePlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter your bid amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or More`;

      // to get improve bid amount
    }
  };

  const buyNFT = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!listingId || !contract) return;

    await buyNow(
      {
        id: listingId,
        buyAmount: 1,
        type: listing?.type!,
      },
      {
        onSuccess(data, variables, context) {
          alert(
            "NFT has been Purchase please check your wallet for owned NFT"
          );
          console.log("SUCCESS", data);
          rout.replace("/");
        },
        onError(error, variables, context) {
          alert("NFT could not be acquired... please try again");
          console.log("ERROR", error);
        },
      }
    );
  };

  const createBidorOffer = async () => {
    //for error handling
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }
      //direct Listing
      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidamount).toString()
        ) {
          console.log("butout price met, buying NFT.. NOW ");
          buyNFT();
          return;
        }

        console.log(
          "buyout amount was not met, please make an offer to buy this NFT"
        );

        await makeOffer(
          {
            quantity: 1,
            listingId,
            pricePerToken: bidamount,
          },
          {
            onSuccess(data, variables, context) {
              alert("NFT has received an offer to buy this NFT");
              console.log("SUCCESS", data, variables, context);
              rout.replace("/");
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert(
                "Offer could not be completed please try again or change the offer amount"
              );
              console.log("ERROR", error, variables, context);
            },
          }
        );
      }

      //Auction Listing
      if (listing?.type === ListingType.Auction) {
        console.log("Making a bid");
        await makeBid(
          {
            listingId,
            bid: bidamount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Auction made successfully");
              console.log("SUCCESS", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("Auction could not be executed please try again");
              console.log("", error, variables, context);
            },
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!listing) {
    return (
      <div>
        <Head>
          <title>Ebay Clone: Loading NFT</title>
          <link rel="icon" href="/ebay-icon.png" />
        </Head>
        <Header />
        <div className="text-center text-green-500 animate-pulse">
          <p>Loading NFT...</p>
        </div>
      </div>
    );
  }
  if (isLoading) {
    <div className="text-green-500">Loading NFT</div>;
  }

  return (
    <div>
      <Head>
        <title>Ebay Clone: {listing.asset.name}</title>
        <link rel="icon" href="/ebay-icon.png" />
      </Head>
      <Header />
      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="card border mx-auto lg:mx-0 max-w-xl shadow-lg h-auto">
          <MediaRenderer src={listing?.asset.image} />
        </div>
        <section className="flex-1  space-y-5  pb-20 lg-pb-0">
          <div>
            <h1 className="text-xl  font-bold"> {listing.asset.name}</h1>
            <p>{listing.asset.description}</p>
            <p>
              <AccountCircleIcon className="text-green-500" />
              <span className="font-bold pr-3">Seller: </span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>

            <p className="font-bold">Buy it Now</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNFT}
              className="col-start-2 mt-5 w-40 bg-blue-500 font-bold border text-white rounded-xl py-1  shadow-lg  hover:bg-white hover:text-blue-500 active:bg-blue-500 active:text-white"
            >
              Buy Now
            </button>
          </div>

          {listing.type === ListingType.Direct && offers?.data && (
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-bold">Offers:</p>
              <p className="font-bold ">
                {offers?.data?.length >= 0 ? offers?.data?.length : 0}
              </p>

              {offers?.data?.map((offer) => (
                <>
                  <p className="flex item-center ml-5 text-sm italic">
                    <AccountCircleIcon className="text-green-500" />
                    {offer.offeror.slice(0, 5) +
                      "..." +
                      offer.offeror.slice(-5)}
                  </p>
                  <div>
                    <p
                      key={
                        offer.listingId +
                        offer.offeror +
                        offer.totalOfferAmount.toString()
                      }
                      className="text-sm italic"
                    >
                      {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                      {NATIVE_TOKENS[network].symbol}
                    </p>
                    {listing.sellerAddress === address && (
                      <button
                        onClick={() => {
                          acceptOffer(
                            {
                              listingId,
                              addressOfOfferor: offer.offeror,
                            },
                            {
                              onSuccess(data, variables, context) {
                                alert("offer accepted");
                                console.log(
                                  "SUCCESS",
                                  data,
                                  variables,
                                  context
                                );
                                rout.replace("/");
                              },
                              onError(error, variables, context) {
                                alert("ERROR: offer could not be accepted");
                                console.log("ERROR", error, variables, context);
                              },
                            }
                          );
                        }}
                        className="p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer"
                      >
                        {" "}
                        Accept Offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />
            <p className="col-span-2 font-bold ">
              {listing.type === ListingType.Direct
                ? "Make and Offer"
                : "Bid on this Auction"}
            </p>

            {/*remaining timne on the bid for this NFT */}

            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p className="font-bold">
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                </p>

                <p>Time Remaining </p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}
            <input
              className="border p-2 rounded-lg mr-5"
              type="text"
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={formatePlaceholder()}
            />
            <button
              onClick={createBidorOffer}
              className="bg-red-600 w-40 border font-bold text-white  rounded-xl py-1  shadow-lg hover:bg-white hover:text-blue-500 active:bg-red-600 active:text-white"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ListingPage;
