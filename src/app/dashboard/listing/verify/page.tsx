"use client";

import { getBusiness } from "@/actions/businessActions";
import LoadingSpinner from "@/components/Loading";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import { encodeToken } from "@/libs/customJWTToken";
import { sendConfirmationEmail } from "@/libs/nodeMailer";
import { getAuNdisProviderDetails } from "@/utils/ndisProviderDetails";
import { CheckCircleIcon, SearchIcon } from "lucide-react";
// import Link from "next/link";
import { useEffect, useState } from "react";

type NdisProviderDetails = {
  name?: string;
  email?: string;
};

const Verify = () => {
  const { displayAlert } = useFeatureContext();

  const [docId, setDocId] = useState<string>("");
  const [abn, setAbn] = useState<string>("");
  const [ndisRegistered, setNdisRegistered] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // const [ndisProviderList, setNdisProviderList] = useState<
  //   NdisProviderDetails[] | null
  // >(null);
  const [provider, setProvider] = useState<NdisProviderDetails | null>({
    name: "",
    email: "",
  });

  const setInitialData = async () => {
    const resp = await getBusiness(["_id", "ndis_registered", "Abn"]);

    const data = JSON.parse(resp);
    if (data.data === null) {
      setLoadingComplete(() => true);
      return;
    }
    setDocId(data.data?._id);
    setAbn(data.data?.Abn);
    setNdisRegistered(data.data.ndis_registered);
    const ndisDetails = await getAuNdisProviderDetails(data.data.Abn);
    // setNdisProviderList(ndisDetails);
    if (ndisDetails) {
      setProvider(ndisDetails[0]);
    }
    setLoadingComplete(() => true);
  };

  useEffect(() => {
    setInitialData();
  }, []);

  const sendVerificationEmail = async () => {
    setLoading(true);
    const token = await encodeToken({ id: docId });
    if (provider?.email) {
      const res = await sendConfirmationEmail(provider.email, token);
      if (res?.success) {
        displayAlert(res.msg, true);
      } else {
        displayAlert("Error Occurred! Try again", false);
      }
    } else {
      displayAlert("No Email Selected", false);
    }
    setLoading(false);
  };

  // const searchNdisProvider = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // if (e.target.value.length > 2) {
  // const searchNdisProvider = async () => {
  //   setLoading(true);
  //   const ndisDetails = await getAuNdisProviderDetails("25948318605");
  //   setNdisProviderList(ndisDetails);
  //   setLoading(false);
  // };

  //   return;
  // }
  // setNdisProviderList(null);
  return (
    <div>
      {!loadingComplete ? (
        <LoadingSpinner />
      ) : (
        <div>
          {!ndisRegistered ? (
            <div>
              <h1 className=" text-3xl font-semibold my-6">
                NDIS Provider Verification
              </h1>
              <div>
                <p className="text-xs mb-1">
                  {/* *Write the provider name (At least 3 characters) */}
                  Abn No.
                </p>

                <div className=" flex gap-2">
                  <CustomInput
                    name="ndis_provider"
                    className=" md:w-[400px]"
                    value={abn}
                    disabled
                    // onChange={searchNdisProvider}
                  />
                  {/* <CustomButton
                onClick={searchNdisProvider}
                type="button"
                isLoading={loading}
              >
                <SearchIcon />
              </CustomButton> */}
                </div>

                {/* {ndisProviderList && (
              <div className=" w-[400px] h-[150px] overflow-y-scroll mt-2 flex flex-col gap-2">
                {ndisProviderList.map((p, i) => {
                  return (
                    <span
                      className="cursor-pointer py-1 bg-slate-400/10"
                      onClick={() => {
                        setProvider(p);
                        setNdisProviderList(null);
                      }}
                      key={i}
                    >
                      {p.email}
                    </span>
                  );
                })}
              </div>
            )} */}
              </div>
              <div className=" mt-4">
                <h1 className=" text-2xl font-semibold">
                  {provider ? "Provider Details:" : "No Provider Found "}
                </h1>
                {provider && provider.name ? (
                  <>
                    <p className="text-lg">
                      <span className=" font-semibold mr-1">Name:</span>
                      {provider.name}
                    </p>
                    <p className="text-lg">
                      <span className=" font-semibold mr-1">Email:</span>
                      {provider.email}
                    </p>
                    <p className="text-xs">
                      {/* The email address shown below is linked to your ABN as
                  registered with NDIS */}
                      Note: This is the official email address listed with NDIS
                      for your business. To complete your registration and
                      verify your NDIS provider status, a verification email
                      will be sent to this address. <br></br>
                      Once your email is verified, you will be awarded the
                      &apos;NDIS Registered Provider&apos; badge. This badge
                      will be displayed on your posts and directory listing,
                      signifying your verified status as an NDIS provider.
                    </p>
                    <p></p>
                    <CustomButton
                      disabled={loading}
                      className=" my-4"
                      isLoading={loading}
                      onClick={sendVerificationEmail}
                    >
                      Send Verification Email
                    </CustomButton>
                  </>
                ) : abn ? (
                  <ul>
                    <li>
                      The ABN provided does not match any registered NDIS
                      provider in our records
                    </li>
                    <li>
                      If you believe this is an error, please check the ABN
                      entered or contact our support team for assistance. If you
                      are not yet a registered NDIS provider, please visit the
                      official NDIS website for information on how to register.
                    </li>
                  </ul>
                ) : (
                  <p>Abn Verification Not Completed !</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="  flex justify-center items-center flex-col rounded-lg shadow-lg py-10 px-20">
                <CheckCircleIcon color="green" size={150} />
                <h1 className=" text-2xl"> Congratulations</h1>
                <h1 className=" text-2xl">NDIS Verification Complete</h1>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verify;
