import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="flex justify-around border-t pt-10 text-xs text-gray-500">
        <div>
          <h1 className="titleFooter">Buy</h1>
          <p className="link">Registration</p>
          <p className="link"> eBay Money Back Guarantee</p>
          <p className="link">Bidding & buying help</p>
          <p className="link">Stores</p>
        </div>
        <div>
          <h1 className="titleFooter">Sell</h1>
          <p className="link">Start selling </p>
          <p className="link">Learn to sell</p>
          <p className="link">Affiliates</p>
          <h1 className="titleFooter"> Tools & apps</h1>
          <p className="link">Developers</p>
          <p className="link">Security center</p>
          <p className="link">Site map</p>
        </div>
        <div>
          <h1 className="titleFooter">Stay connected</h1>
          <p className="link">Facebook</p>
          <p className="link">Twitter</p>
        </div>
        <div>
          <h1 className="titleFooter">About eBay</h1>
          <p className="link">Company Info</p>
          <p className="link">News</p>
          <p className="link">Investors</p>
          <p className="link">Careers</p>
          <p className="link">Government relations</p>
          <p className="link">Advertise with us</p>
          <p className="link">Policies</p>
          <p className="link">Verified Rights Owner (VeRO) Program</p>
        </div>
        <div>
          <h1 className="titleFooter">Help & Contact</h1>
          <p className="link">Seller Information Center</p>
          <p className="link">Contact us</p>
          <h1 className="titleFooter">Community</h1>
          <p className="link">Announcements</p>
          <p className="link">Discussion boards</p>
          <p className="link">eBay Giving Works</p>
        </div>
      </div>

      <p className="text-xs pt-5">
        {" "}
        Copyright © 1995-{ currentYear } eBay inc. All Rights reserved.
        <span>
          <a className="underline" href="">
            {" "}
            Accessibility
          </a>
        </span>{" "}
        ,
        <span>
          <a className="underline" href="">
            {" "}
            User Agreement
          </a>
        </span>{" "}
        ,
        <span>
          <a className="underline" href="">
            {" "}
            Privacy
          </a>
        </span>{" "}
        ,
        <span>
          <a className="underline" href="">
            {" "}
            Payments Terms of Use
          </a>
        </span>{" "}
        ,
        <span>
          <a className="underline" href="">
            Cookies
          </a>
        </span>{" "}
        ,
        <span>
          <a className="underline" href="">
            {" "}
            Do not sell my personal information
          </a>
        </span>{" "}
        and ,
        <span>
          <a className="underline" href="">
            {" "}
            AdChoice
          </a>
        </span>
      </p>
    </div>
  );
};

export default Footer;
