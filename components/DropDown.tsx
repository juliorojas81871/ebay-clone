import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ThemeToggler } from "./";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

const Dropdown = () => {
  return (
    <div>
      <Menu as="div">
        <Menu.Button>
          <p className="flex items-center hover:link">
            My eBay <ExpandMoreIcon />
          </p>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute border-blue-600 border-[1px] rounded-md bg-white w-28 mt-2 origin-top-right shadow-sm ring-1 ring-blue-600 ring-opacity-5 focus:outline-none dark:bg-black">
            <div className="px-1 py-1 hover:bg-gray-200/100 dark:hover:bg-neutral-700/60">
              <Menu.Item>
                <Link className="" href="/addItem">
                  {" "}
                  Mint / Add Item
                </Link>
              </Menu.Item>
            </div>
            <div className="px-1 py-1 flex flex-col justify-center items-center">
              <Menu.Item>
                <ThemeToggler />
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
