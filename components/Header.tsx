import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import LanguageIcon from "@mui/icons-material/Language";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Link from "next/link";
import Image from "next/image";
import { ConnectWallet } from "@thirdweb-dev/react";

type Props = {};

function Header({}: Props) {
  const address = useAddress();
  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="sm:hidden p-2 flex justify-center">
        <Link href="/">
          <Image
            alt="THirdweb ebaylogo"
            width={80}
            height={80}
            src="/ebay-logo.png"
            className=" h-full w-full object-contain"
          />
        </Link>
      </div>
      <nav className="flex justify-between items-center text-sm">
        <div className="flex items-center md:space-x-4 space-x-2 ">
          <ConnectWallet 
            className="relative flex items-centerborder-blue-600 outline-none space-x-4 rounded-lg px-7 py-4 leading-none transition duration-200 text-blue-600 hover:bg-blue-600/50 hover:text-white"
            colorMode="light"
          />
          <p className="headerLinks hidden lg:inline">eBay Offers</p>
          <p className="headerLinks">Help & Contact</p>
        </div>
        <div className="flex items-center text-sm space-x-4">
          <LanguageIcon className="headerLinks hidden lg:inline" />
          <p className="headerLinks hidden lg:inline">Ship to</p>
          <p className="headerLinks"> Sell</p>
          <p className="headerLinks">Watchlist</p>
          <Link className="flex items-center hover:link" href="/addItem">
            {" "}
            Add to inventory <ExpandMoreIcon />
          </Link>
          <p className="headerLinks hidden lg:inline">
            {" "}
            My eBay{" "}
            <span>
              <ExpandMoreIcon />
            </span>
          </p>
          <NotificationsNoneIcon />
          <ShoppingCartOutlinedIcon />
          <p className=""></p>
        </div>
      </nav>
      <hr className="mt-2" />

      <section className="flex items-center space-x-2 py-5">
        <div className="h-16 mt-2 w-28 md:w-44 cursor-pointer flex-shrink-0 hidden sm:inline">
          <Link href="/">
            <Image
              alt="THirdweb ebaylogo"
              width={100}
              height={100}
              src="/ebay-logo.png"
              className=" h-full w-full object-contain"
            />
          </Link>
        </div>
        <button className="hidden lg:flex items-center space-x-2 w-20">
          <p className="text-gray-600 text-sm">Shop by Category</p>
          <ExpandMoreIcon />
        </button>

        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-black border-2 flex-1">
          <SearchOutlinedIcon className="text-gray-300 " />
          <input
            className="flex-1 outline-none"
            type="text"
            placeholder="Search for anything"
          />
          <button className="border-gray-300 border-l pl-4 whitespace-nowrap text-sm">
            {" "}
            All Catergories <ExpandMoreIcon />
          </button>
        </div>

        <button className="hidden sm:inline bg-blue-600 text-white px-5 md:px-10 py-2 border-2 border-blue-700">
          Search
        </button>
        {address ? (
          <Link href="/create">
            <button className=" border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white whitespace-nowrap">
              List Item
            </button>
          </Link>
        ) : (
          ""
        )}
      </section>
      <hr />

      <section>
        <div className="flex justify-around items-center py-1 text-sm whitespace-nowrap">
          <Link className="link" href="/">
            <p>Home</p>
          </Link>
          <p className="link">
            <FavoriteOutlinedIcon /> Saved{" "}
          </p>
          <p className="link">Electronics</p>
          <p className="link">Fashion</p>
          <p className="link hidden sm:inline">Health & Beauty</p>
          <p className="link hidden sm:inline">Motors</p>
          <p className="link hidden md:inline">Collectibles and Art</p>
          <p className="link hidden lg:inline">Industrial equipment</p>
          <p className="link hidden lg:inline">Sports</p>
          <p className="link hidden lg:inline"> Home & Garden</p>
          <p className="link hidden xl:inline">Deals</p>
          <p className="link hidden xl:inline">Sell</p>
          <p className="link">
            More <ExpandMoreIcon />
          </p>
        </div>
      </section>
    </div>
  );
}

export default Header;
