"use client";

import { getBusiness, postBusinessData } from "@/actions/businessActions";
import LoadingSpinner from "@/components/Loading";
import CustomButton from "@/components/ui/CustomButton";
import SmallVerificationBox from "@/components/ui/SmallVerificationBox";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import { uploadImage } from "@/libs/cloudinary";
import { serviceLocationsType } from "@/types/business";
import { MapPin, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

const Card = () => {
  const router = useRouter();
  const { displayAlert } = useFeatureContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const [BusinessName, setBusinessName] = useState("Business Name");
  const [BusType, setBusType] = useState("Business Name");
  const [imagePreview, setImagePreview] = useState("");
  const [serviceLocations, setServiceLocations] =
    useState<serviceLocationsType>([]);
  const [blurb, setBlurb] = useState("");
  const [rank, setRank] = useState("");
  const [ndisRegistered, setNdisRegistered] = useState(false);
  const [image, setImage] = useState({
    banner: "",
    card: "",
    avatar: "",
  });

  const saveImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const fileData = e.target.files?.[0];
    if (!fileData) {
      return;
    }
    const fileReader = new FileReader();
    if (fileData) {
      fileReader.readAsDataURL(fileData);
      fileReader.onloadend = async () => {
        setImagePreview(fileReader.result as string);
        return setLoading(false);
      };
    }
    setLoading(false);
  };

  const setInitialData = async () => {
    const resp = await getBusiness([
      "blurb",
      "serviceLocations",
      "BusinessName",
      "image",
      "rank",
      "EntityTypeCode",
      "ndis_registered",
    ]);

    const data = JSON.parse(resp);

    if (data.data === null) {
      setLoadingComplete(() => true);
      return;
    }

    setServiceLocations(
      data.data?.serviceLocations.length ? data.data.serviceLocations : []
    );

    setBlurb(data.data.blurb ? data.data.blurb : "");
    setBusinessName(data.data.BusinessName.join(" "));
    setImage(data.data?.image);
    setBusType(data.data.EntityTypeCode);
    setRank(data.data.rank);
    setNdisRegistered(data.data.ndis_registered);

    setLoadingComplete(() => true);
  };

  useEffect(() => {
    setInitialData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    let updatedImage = { ...image };

    if (imagePreview) {
      const url = await uploadImage(imagePreview);

      if (url) {
        updatedImage = { ...updatedImage, card: url };
      }
    }

    const infos = {
      blurb,
      image: updatedImage,
    };

    const data = await postBusinessData(infos);
    if (data.success) {
      displayAlert(data.message, true);
      router.push("/dashboard/listing/verify");
    } else {
      displayAlert(data.message, false);
    }
    setLoading(false);
  };

  return (
    <div>
      {loadingComplete ? (
        <div>
          <div className=" grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-3 gap-x-10">
            <div className="col-span-1 md:col-span-2 flex flex-col ">
              <div className=" flex flex-col md:flex-row gap-2 items-center mt-2">
                <div className=" w-full md:w-[400px] flex items-start justify-center flex-col">
                  <label
                    htmlFor="file_input"
                    className="block text-sm font-medium leading-6 mb-2 text-gray-900"
                  >
                    Listing card Image
                  </label>
                  <input
                    className=" w-full md:w-full  py-2 px-2 md:px-4 block text-sm text-white rounded-md cursor-pointer bg-btn-orange focus:outline-none"
                    id="file_input"
                    type="file"
                    accept=".svg,.png,.jpg"
                    onChange={saveImage}
                  />
                </div>
                <CustomButton
                  isLoading={loading}
                  disabled={loading}
                  title="clear"
                  className="w-fit self-start md:self-end text-red-500 flex items-center "
                  onClick={() => {
                    setImagePreview("");
                    setImage({ ...image, card: "" });
                  }}
                >
                  <X />
                </CustomButton>
              </div>
              <div className=" my-4">
                <label
                  htmlFor="blurb"
                  className="block text-sm font-medium leading-6 mb-2 text-gray-900"
                >
                  Blurb (Maximum 143 Characters)
                </label>

                <div className="mt-2 relative">
                  <textarea
                    id="blurb"
                    name="blurb"
                    rows={3}
                    maxLength={143}
                    className="block w-full md:w-[700px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none outline-none placeholder:text-gray-400  text-sm md:text-base sm:leading-6"
                    value={blurb}
                    onChange={(e) => setBlurb(e.target.value)}
                  />
                  <span className="absolute text-red-400 right-2 bottom-2 md:right-32 md:bottom-2 text-xs">
                    {blurb.length}/143
                  </span>
                </div>
              </div>
            </div>

            {/* //! preview  */}
            <div className=" col-span-1 w-full min-h-[326px]">
              <h1 className=" text-3xl font-semibold mb-4">Preview</h1>
              <div className="w-[281px] h-[326px] flex flex-col gap-3 items-start">
                <div className="w-[281px] h-[200px] overflow-hidden">
                  {imagePreview ? (
                    <Image
                      className="rounded-md w-[281px] h-[200px]"
                      src={imagePreview}
                      alt="business"
                      width={281}
                      height={200}
                    />
                  ) : image && image.card ? (
                    <Image
                      className="rounded-md w-[281px] h-[200px]"
                      src={image.card}
                      alt="business"
                      width={281}
                      height={200}
                    />
                  ) : (
                    <Image
                      className="rounded-md w-[281px] h-[200px]"
                      src="/image.webp"
                      alt="business"
                      width={281}
                      height={200}
                    />
                  )}
                </div>

                <p className=" text-sm h-5 font-semibold line-clamp-1 overflow-ellipsis">
                  {BusinessName}
                </p>
                <div className="flex gap-2">
                  <SmallVerificationBox className="py-1.5 px-3 text-sm font-semibold">
                    {BusType === "IND" ? "Sole Trader" : "Organisation"}
                  </SmallVerificationBox>
                  {ndisRegistered && (
                    <SmallVerificationBox>Ndis-Registered</SmallVerificationBox>
                  )}
                </div>
                <p className="w-full h-[55px] line-clamp-3 text-[12px] break-words font-medium leading-4">
                  {blurb}
                </p>

                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center">
                    <MapPin className="mr-1" size={18} strokeWidth={2} />
                    {serviceLocations.map((l, i) => {
                      const regex = /\(([^)]+)\)/;
                      const match = l.state.match(regex);
                      return (
                        <span className="text-sm font-semibold" key={i}>
                          {match?.[1]}
                          {i + 1 < serviceLocations.length ? ", " : ""}
                        </span>
                      );
                    })}
                  </div>
                  <span className="font-semibold text-sm">
                    Overall Rank {rank ? rank : ": Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="my-6">
            <CustomButton
              isLoading={loading}
              onClick={handleSubmit}
              className=" w-40"
              disabled={loading}
            >
              Save
            </CustomButton>
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Card;
