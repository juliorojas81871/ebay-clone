import type { NextPage } from "next";
import Head from "next/head";
import { Header, Coursel } from "../components";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import Link from "next/link";

const Home: NextPage = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  return (
    <div>
      <Head>
        <title>Ebay Clone</title>
        <link rel="icon" href="/ebay-icon.png" />
      </Head>

      <Header />
      <Coursel />
      <main className="max-w-6xl mx-auto p-2">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-500">
            Loading Listing please wait...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings?.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <div className="flex flex-col z-30 shadow-lg card hover:scale-105 transition-all duration-150 ease-in-out ">
                  <div className="flex flex-1 flex-col pb-2 items-center">
                    <MediaRenderer className="w-44" src={listing.asset.image} />{" "}
                    {/*//MediaRenderer is used to render images from THirdweb*/}
                  </div>

                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-lg text-blue-300 shadow-md font-bold text-center">
                        {listing.asset.name}
                      </h2>
                      <hr />
                      <p className=" truncate text-sm text-gray-600 mt-2">
                        {listing.asset.description}
                      </p>
                    </div>
                    <p>
                      <span className="font-bold mr-2">
                        {listing.buyoutCurrencyValuePerToken.displayValue}
                      </span>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                    <div
                      className={`flex items-center  space-x-1 justify-between `}
                    >
                      <p>
                        {listing.type === ListingType.Direct ? (
                          <button className="bg-blue-500 px-2 rounded-sm shadow-md text-white hover:bg-white hover:text-blue-500">
                            {" "}
                            Buy Now
                          </button>
                        ) : (
                          <button className="bg-gray-500 px-2 rounded-sm shadow-md text-white hover:bg-white hover:text-blue-500">
                            Auction
                          </button>
                        )}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <MonetizationOnIcon className="" />
                      ) : (
                        <AvTimerIcon />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
