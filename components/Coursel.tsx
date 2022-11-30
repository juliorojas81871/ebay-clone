import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import Image from "next/image";

const Coursel = () => {
  return (
    <div className="relative xl:h-screen">
      <div className="absolute h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        <div>
          <img
            src="/carousel1.webp"
            loading="lazy"
            alt=""
          />
        </div>
        <div>
          <img
            src="carousel2.webp"
            loading="lazy"
          />
        </div>
        <div className="flex justify-around items-center bg-gray-100  text-left">
          <div className="flex items-center flex-col justify-center bg-gray-100">
            <h1>Soccer eupnoria is here</h1>
            <p>Show your passion and take amazing collectibles with you</p>
            <button className="bg-blue-500 px-2 rounded-sm shadow-md text-white hover:bg-white hover:text-blue-500">
              Go Now! <ArrowForwardOutlinedIcon />
            </button>
          </div>
          <div className="flex overflow-hidden mr-0 max-w-6xl">
            <Image
              width={200}
              height={200}
              objectFit="contain"
              className="w-[100px] object-contain"
              src="/carousel3-1.webp"
              alt="first"
              loading="lazy"
            />
            <Image
              width={200}
              height={200}
              objectFit="contain"
              src="/carousel3-2.webp"
              alt="second"
              loading="lazy"
            />
            <Image
              width={200}
              height={200}
              objectFit="contain"
              src="/carousel3-3.webp"
              alt="third"
              loading="lazy"
            />
          </div>
        </div>
      </Carousel>
    </div>
  );
}

export default Coursel;
