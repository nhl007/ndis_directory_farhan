"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils/utils";

interface Props {
  state: string;
  suburbs: string[];
  classNames?: string;
}

const LocationDropdown = ({ state, suburbs, classNames }: Props) => {
  const [showSuburbs, setShowSuburbs] = useState(false);
  return (
    <div
      className={cn(
        "flex h-fit flex-col gap-2 w-[250px] border-yellow-300 border-[1px] rounded-lg",
        classNames
      )}
    >
      <div
        className={`flex justify-between items-center border-b-[0.5px] ${
          showSuburbs ? "" : "rounded-b-lg"
        } border-b-yellow-300 bg-yellow-light rounded-t-lg px-5 py-3`}
      >
        <span className="line-clamp-1">{state}</span>
        <button onClick={() => setShowSuburbs((prev) => !prev)}>
          {showSuburbs ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {showSuburbs && (
        <div className="flex flex-col gap-1 px-5 pb-3">
          {suburbs.map((sub) => {
            return (
              <div key={sub}>
                <span>{sub}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
