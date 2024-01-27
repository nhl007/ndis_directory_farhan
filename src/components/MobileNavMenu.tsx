"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const MobileNav = () => {
  const [menu, setMenu] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setMenu((prev) => !prev)}>
        {!menu ? <Menu /> : <X />}
      </button>
      {menu && (
        <div className="z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
          <p className=" text-lg font-medium ml-4">Navigation</p>

          <ul
            className="py-2 text-sm text-gray-700"
            aria-labelledby="avatarButton"
          >
            <li>
              <Link
                onClick={() => setMenu(false)}
                href="/directory"
                className="block pl-4 py-2 hover:bg-gray-100"
              >
                Directory
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenu(false)}
                href="/on-board"
                className="block pl-4 py-2 hover:bg-gray-100"
              >
                List Business
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
