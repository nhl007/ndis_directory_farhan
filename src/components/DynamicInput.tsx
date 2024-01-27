"use client";

import { Check, X } from "lucide-react";
import { SetStateAction, useState } from "react";

interface InputProps {
  name: string;
  data: string[];
  setData: React.Dispatch<SetStateAction<string[]>>;
}

const DynamicInput = ({ name, data, setData }: InputProps) => {
  const [curr, setCurr] = useState("");

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      addToList(e.target.value);
    }
  };

  const addToList = (input: string) => {
    if (input) {
      setData(() => [...data, input]);
      setCurr("");
    }
  };

  const removeItem = (i: number) => {
    const updatedData = data.filter((_, index) => index !== i);
    setData(updatedData);
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 mb-2 text-gray-900"
      >
        {name}
      </label>
      <div className="mt-2 border-[1px] pl-2 min-h-[38px] flex items-center py-1">
        <div className="flex w-full justify-between items-center py-[0.5px]">
          <div className="flex flex-wrap items-center max-w-full w-full">
            {data ? (
              <div className="flex gap-2 items-center flex-grow-0 flex-wrap">
                {data.map((d, i) => {
                  return (
                    <div
                      className="flex items-center gap-2 bg-slate-400 rounded-sm py-1 px-2"
                      key={d + i}
                    >
                      <span className="text-center text-sm ">{d}</span>
                      <X
                        size={16}
                        className=" hover:bg-red-300 cursor-pointer"
                        onClick={() => removeItem(i)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
            <div className="flex flex-grow">
              <input
                type="text"
                name={name}
                value={curr}
                id={name}
                onChange={(e) => setCurr(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Write and press enter!"
                className="w-full border-0 py-1 pl-2 text-sm md:text-base text-gray-900  placeholder:text-gray-400 sm:text-sm sm:leading-6 shadow-none  focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-center h-full gap-2 md:gap-3 w-fit pr-2">
            <button
              className=" bg-green-600 text-white px-1 rounded-sm"
              onClick={() => addToList(curr)}
            >
              <Check size={20} />
            </button>
            <button
              className=" bg-red-600 text-white px-1 rounded-sm"
              onClick={() => setData([])}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicInput;
