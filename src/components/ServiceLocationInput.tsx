import { serviceLocationsType } from "@/types/business";
import { Check, X } from "lucide-react";
import { SetStateAction, useState } from "react";
// import DynamicInput from "./DynamicInput";
import LocationDropdown from "./LocationDropdown";
// import CustomInput from "./ui/CustomInput";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import Select from "react-select";
import { statesOptions } from "@/constants/constants";
import { getSuburbsByState } from "@/utils/postalCodeSearch";
import LargeDropdown from "./SuburbsOptions";
import { generateSelectDefault } from "@/utils/utils";

interface LocationProps {
  data: serviceLocationsType;
  setData: React.Dispatch<SetStateAction<serviceLocationsType>>;
}

const ServiceLocationInput = ({ data, setData }: LocationProps) => {
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [curr, setCurr] = useState<string>("");
  const { displayAlert } = useFeatureContext();

  const addToList = () => {
    if (!suburbs.length || curr.length < 2) {
      return displayAlert("State or suburbs missing!", false);
    }

    setData((prevData) => {
      const newStateData = prevData.map((item) => {
        if (item.state === curr) {
          // If the state already exists, update the suburbs
          return {
            ...item,
            suburbs: suburbs,
          };
        } else {
          // If the state doesn't match, keep the item unchanged
          return item;
        }
      });

      // If the state doesn't exist, add a new entry
      if (!newStateData.some((item) => item.state === curr)) {
        newStateData.push({
          state: curr,
          suburbs: suburbs,
        });
      }

      return newStateData;
    });

    setCurr("");
    setSuburbs([]);
  };

  const removeItem = (i: number) => {
    const updatedData = data.filter((_, index) => index !== i);
    setData(updatedData);
  };

  const [suburbsOptions, setSuburbsOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const getSuburbsOption = async (state: string) => {
    if (!state) {
      displayAlert("Please select the state first!", false);
    }
    setCurr(state ?? "");

    const regex = /\(([^)]+)\)/;
    const match = state.match(regex);

    const word = match ? match[1] : "";
    // console.log(data);
    let oldSuburbs: string[] = [];

    data.map((c) => {
      if (state === c.state) {
        oldSuburbs = c.suburbs;
      }
    });

    if (oldSuburbs) {
      setSuburbs(oldSuburbs);
    } else {
      setSuburbs([]);
    }

    const suburbs = await getSuburbsByState(word);

    if (suburbs) {
      setSuburbsOptions(suburbs);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col mt-2 col-span-2 gap-2">
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Select State first, Then choose suburbs
          </label>

          <Select
            id="state"
            instanceId="state"
            name="state"
            options={statesOptions}
            className="w-full md:w-[270px] h-auto text-base"
            value={generateSelectDefault([curr])}
            onChange={(val) => {
              getSuburbsOption(val?.value as string);
            }}
            isSearchable={true}
            placeholder="Select State"
          />
        </div>
        <div className="col-span-3 md:col-span-full">
          <LargeDropdown
            setSuburbs={setSuburbs}
            suburbs={suburbs}
            suburbsOptions={suburbsOptions}
            isDisabled={curr === "" ? true : false}
          />
        </div>
        <button
          className=" w-fit bg-green-600 text-white px-3 py-2 rounded-md mb-4 flex gap-1 mt-2 items-center"
          onClick={addToList}
        >
          Add
          <Check size={18} />
        </button>
      </div>
      <h2 className=" text-xl font-bold my-2">
        Inserted Service Location Records
      </h2>
      <div className="flex flex-wrap gap-4">
        {data && data.length
          ? data.map((loc, i) => {
              return (
                <div className="relative w-full" key={loc.state + i}>
                  <LocationDropdown
                    classNames="w-full"
                    state={loc.state}
                    suburbs={loc.suburbs}
                  />
                  <X
                    size={16}
                    className=" absolute top-[2px] right-[2px] text-red-400 cursor-pointer"
                    onClick={() => removeItem(i)}
                  />
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default ServiceLocationInput;
