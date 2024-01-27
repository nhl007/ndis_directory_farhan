"use client";

import { useEffect, useState } from "react";

import { searchValidABN } from "@/actions/abrApi";
import { AbnLookupResult } from "@/types/business";
import CustomButton from "./ui/CustomButton";
import { Search, X } from "lucide-react";
import { getBusiness, postBusinessData } from "@/actions/businessActions";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import CustomInput from "./ui/CustomInput";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./Loading";

const AbnLookupForm = () => {
  const router = useRouter();
  const [abnDetails, setAbnDetails] = useState<Partial<AbnLookupResult> | null>(
    null
  );
  const [loading, setIsLoading] = useState<boolean>(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [abn, setAbn] = useState<string>("");

  const { displayAlert } = useFeatureContext();

  const searchAbn = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    const data = await searchValidABN(abn);

    if (data) {
      if (data.AbnStatus === "Active") {
        setAbnDetails(() => data);
      } else {
        displayAlert("The Abn is not Active!", false);
      }
    } else {
      displayAlert("No Active ABN Found!", false);
    }
    setIsLoading(false);
  };

  const confirmAbnDetails = async () => {
    setIsLoading(true);

    const data = await postBusinessData({ ...abnDetails, abnVerified: true });
    if (data.success) {
      displayAlert(data.message, true);
      router.push("/dashboard/listing/page");
    } else {
      displayAlert(data.message, false);
    }
    setIsLoading(false);
  };

  const setInitialData = async () => {
    const resp = await getBusiness([
      "Abn",
      "AbnStatus",
      "AbnStatusEffectiveFrom",
      "Acn",
      "AddressDate",
      "AddressPostcode",
      "AddressState",
      "BusinessName",
      "EntityName",
      "EntityTypeCode",
      "EntityTypeName",
      "Gst",
    ]);

    const data = JSON.parse(resp);

    if (data.data) {
      setAbn(data.data.Abn);
      setAbnDetails(data.data);
    }
    setLoadingComplete(() => true);
  };

  useEffect(() => {
    setInitialData();
  }, []);

  return (
    <div>
      {loadingComplete ? (
        <div>
          <div>
            <label
              htmlFor="abn"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Registered ABN Number <span className=" text-red-600">*</span>
            </label>
            <div className="mt-2">
              <div className="flex gap-4 rounded-md shadow-sm sm:max-w-md">
                <CustomInput
                  value={abn}
                  onChange={(e) => {
                    setAbn(e.target.value);
                    setAbnDetails(null);
                  }}
                  type="text"
                  name="abn"
                  id="abn"
                  // pattern="^[0-9\s]*$"
                  placeholder="abn number"
                />
                {abnDetails ? (
                  <button
                    onClick={() => {
                      setAbn("");
                      setAbnDetails(null);
                    }}
                  >
                    <X />
                  </button>
                ) : (
                  <CustomButton
                    disabled={abn.length <= 7}
                    // disabled
                    onClick={searchAbn}
                    type="button"
                    isLoading={loading}
                  >
                    <Search />
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
          {abnDetails && abn ? (
            <div className="border-b border-t border-gray-900/10 py-12 mt-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                ABN Lookup
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Information associated to ABN Number : {abn}
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Abn Status
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      id="city"
                      disabled
                      type="text"
                      name="status"
                      value={abnDetails.AbnStatus}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="addressState"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ACN
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      id="addressState"
                      disabled
                      type="text"
                      name="ACN"
                      value={abnDetails.Acn}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ABN Active From
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      name="activeFrom"
                      value={abnDetails.AbnStatusEffectiveFrom}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Business Name
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      name="businessName"
                      value={
                        abnDetails.BusinessName
                          ? abnDetails.BusinessName.join(", ")
                          : "No name found"
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="addressState"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    GST
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      name="gst"
                      value={abnDetails.Gst}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Entity Type Code
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      name="entityTypeCode"
                      value={abnDetails.EntityTypeCode}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Entity Name
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      value={abnDetails.EntityName}
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Entity Type Name
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      value={abnDetails.EntityTypeName}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="postCode"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Post Code
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      name="postCode"
                      id="postCode"
                      value={abnDetails.AddressPostcode}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="addressState"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    AddressState
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      disabled
                      type="text"
                      name="addressState"
                      id="addressState"
                      value={abnDetails.AddressState}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address_date"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Address Date
                  </label>
                  <div className="mt-2">
                    <CustomInput
                      type="text"
                      name="address_date"
                      id="address_date"
                      value={abnDetails.AddressDate}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2">No Details Available</div>
          )}

          <div className="my-6">
            {abn && abnDetails ? (
              <CustomButton
                onClick={confirmAbnDetails}
                type="submit"
                isLoading={loading}
              >
                Confirm
              </CustomButton>
            ) : null}
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default AbnLookupForm;
