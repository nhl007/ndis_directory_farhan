"use client";

import Select from "react-select";
import Image from "next/image";
import {
  CarFront,
  FacebookIcon,
  Globe,
  Mail,
  MousePointerClick,
  PersonStanding,
  Phone,
  X,
} from "lucide-react";
import BorderBox from "@/components/ui/BorderBox";
import { getBusiness, postBusinessData } from "@/actions/businessActions";
import { serviceAgeNames, serviceLocationsType } from "@/types/business";
import Link from "next/link";
import { useEffect, useState } from "react";
import { generateSelectDefault } from "@/utils/utils";
import {
  agesSupportedOptions,
  complexNeedsSupportedOptions,
  genderOfAttendanceOptions,
  selectDeliveryOptions,
  selectLanguages,
  selectOptions,
} from "@/constants/constants";
import CustomInput from "@/components/ui/CustomInput";
import ServiceLocationInput from "@/components/ServiceLocationInput";
import CustomButton from "@/components/ui/CustomButton";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import { uploadImage } from "@/libs/cloudinary";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loading";
import QuillTextEditor from "@/components/QuillTextEditor";
import SmallVerificationBox from "@/components/ui/SmallVerificationBox";

export const dynamic = "force-dynamic";

const CreateList = () => {
  const router = useRouter();
  const { displayAlert } = useFeatureContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [BusinessName, setBusinessName] = useState("Business Name");
  const [entityCode, setEntityCode] = useState("");
  const [ndisRegistered, setNdisRegistered] = useState(false);
  const [about, setAbout] = useState<string>("");
  const [services, setServices] = useState<string[]>([]);
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([]);
  const [image, setImage] = useState({
    banner: "",
    card: "",
    avatar: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imagePreviewAvatar, setImagePreviewAvatar] = useState("");
  const [loadingComplete, setLoadingComplete] = useState(false);

  const [complexNeedsSupported, setComplexNeedsSupported] = useState<string[]>(
    []
  );

  const [genderOfAttendants, setGenderOfAttendants] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [agesSupported, setAgesSupported] = useState<serviceAgeNames[]>([]);

  const [serviceLocations, setServiceLocations] =
    useState<serviceLocationsType>([]);
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);

    const infos: Record<string, any> = {
      about,
      services,
      deliveryOptions,
      languages,
      agesSupported,
      genderOfAttendants,
      complexNeedsSupported,
      serviceLocations,
      contact: {
        email,
        phone,
        website,
        facebook,
        twitter,
      },
    };

    let updatedImage = { ...image };

    await Promise.all([
      (async () => {
        if (imagePreviewAvatar) {
          const avatarUrl = await uploadImage(imagePreviewAvatar);
          if (avatarUrl) {
            updatedImage = { ...updatedImage, avatar: avatarUrl };
          }
        }

        if (imagePreview) {
          const bannerUrl = await uploadImage(imagePreview);
          if (bannerUrl) {
            updatedImage = { ...updatedImage, banner: bannerUrl };
          }
        }
      })(),
    ]);

    infos.image = updatedImage;

    const data = await postBusinessData(infos!);
    if (data.success) {
      displayAlert(data.message, true);
      router.push("/dashboard/listing/card");
    } else {
      displayAlert(data.message, false);
    }
    setLoading(false);
  };

  const setInitialData = async () => {
    const resp = await getBusiness([
      "about",
      "services",
      "deliveryOptions",
      "contact",
      "serviceLocations",
      "languages",
      "agesSupported",
      "genderOfAttendants",
      "complexNeedsSupported",
      "BusinessName",
      "EntityTypeCode",
      "ndis_registered",
      "image",
    ]);

    const data = JSON.parse(resp);

    setServiceLocations(
      data.data?.serviceLocations.length ? data.data.serviceLocations : []
    );

    if (data.data === null) {
      setLoadingComplete(() => true);
      return;
    }

    setImage(data.data.image);

    setBusinessName(data.data.BusinessName);
    setEntityCode(data.data.EntityTypeCode);
    setNdisRegistered(data.data.ndis_registered);
    setAbout(data.data.about);
    setServices(data.data.services);
    setDeliveryOptions(data.data.deliveryOptions);

    setEmail(data.data?.contact?.email ? data.data.contact.email : "");
    setPhone(data.data?.contact?.phone ? data.data.contact.phone : "");
    setWebsite(data.data?.contact?.website ? data.data.contact.website : "");
    setFacebook(data.data?.contact?.facebook ? data.data.contact.facebook : "");
    setTwitter(data.data?.contact?.twitter ? data.data.contact.twitter : "");

    setAgesSupported(data.data.agesSupported);
    setLanguages(data.data.languages);
    setGenderOfAttendants(data.data.genderOfAttendants);
    setComplexNeedsSupported(data.data.complexNeedsSupported);
    setLoadingComplete(() => true);
  };

  useEffect(() => {
    setInitialData();
  }, []);

  const saveImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const fileData = e.target.files?.[0];
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

  const saveImagePreviewAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const fileData = e.target.files?.[0];
    const fileReader = new FileReader();
    if (fileData) {
      fileReader.readAsDataURL(fileData);
      fileReader.onloadend = async () => {
        setImagePreviewAvatar(fileReader.result as string);
        return setLoading(false);
      };
    }
    setLoading(false);
  };

  return (
    <div>
      {loadingComplete ? (
        <div>
          <div>
            <div className="my-6">
              <span className="text-3xl font-medium my-6">
                Upload a banner :
              </span>
              <div className="">
                <div className=" flex gap-4 justify-center-center mt-2 flex-col">
                  <div className="w-[300px] flex flex-col gap-1 justify-start">
                    <p>Banner:</p>

                    <input
                      className=" py-2 px-4 block w-full text-sm text-white rounded-md cursor-pointer bg-btn-orange focus:outline-none"
                      id="file_input_banner"
                      type="file"
                      accept=".svg,.png,.jpg"
                      onChange={saveImagePreview}
                    />
                    <p>Avatar:</p>
                    <input
                      className=" py-2 px-4 block w-full text-sm text-white rounded-md cursor-pointer bg-btn-orange focus:outline-none"
                      id="file_input_avatar"
                      type="file"
                      accept=".svg,.png,.jpg"
                      onChange={saveImagePreviewAvatar}
                    />
                    <p className="text-xs font-medium mt-1 ">
                      SVG, PNG, JPG (MAX. 1200x300px).
                    </p>
                  </div>
                  <CustomButton
                    isLoading={loading}
                    disabled={loading}
                    title="clear"
                    className="w-fit text-red-500 flex items-center "
                    onClick={() => {
                      setImagePreview("");
                      setImagePreviewAvatar("");
                      setImage({ ...image, banner: "", avatar: "" });
                    }}
                  >
                    <X />
                  </CustomButton>
                </div>
              </div>
            </div>
            <span className="text-2xl font-medium">Preview</span>

            <div
              className={`${
                loadingComplete ? "flex" : "hidden"
              } h-[300px] bg-cover py-5 md:py-8 relative`}
              style={{
                backgroundImage: `url('${
                  imagePreview
                    ? imagePreview
                    : image?.banner
                    ? image?.banner
                    : "/image.webp"
                }')`,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  className="rounded-full w-[150px] h-[150px]  object-cover absolute bottom-[-70px] left-[50px]"
                  width={120}
                  height={120}
                  priority={true}
                  src={
                    imagePreviewAvatar
                      ? imagePreviewAvatar
                      : image?.avatar
                      ? image.avatar
                      : "/image.jpg"
                  }
                  alt="name"
                />
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-semibold max-w-full  line-clamp-2 mt-16 mb-6">
              {BusinessName}
            </h1>
          </div>
          <div className=" flex gap-3">
            <SmallVerificationBox className="w-fit my-4 bg-green-500 text-white">
              {entityCode === "IND" ? "Sole Trader" : "Organisation"}
            </SmallVerificationBox>

            {ndisRegistered && (
              <SmallVerificationBox className="w-fit my-4 bg-yellow-500 text-white">
                Ndis-Registered
              </SmallVerificationBox>
            )}
          </div>

          <div className="grid md:grid-flow-col md:grid-cols-8 md:gap-x-6 mt-8 mb-20">
            {/* //! left side */}
            <div className="col-span-full md:col-span-5 flex flex-col gap-4 md:gap-6">
              <BorderBox>
                <div className="md:col-span-full col-span-3 h-[400px]">
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about your business.
                  </p>

                  <QuillTextEditor html={about} setHtml={setAbout} />
                </div>
                <h1 className=" text-2xl font-medium">About</h1>
                <div
                  className="aboutSectionClass"
                  dangerouslySetInnerHTML={{ __html: about }}
                />
              </BorderBox>

              <BorderBox>
                <Select
                  id="services"
                  value={generateSelectDefault(services)}
                  isMulti
                  instanceId="services"
                  name="services"
                  options={selectOptions}
                  className="basic-multi-select mb-4"
                  onChange={(val) => {
                    const data = val.map((d: any) => d.value);
                    setServices(data);
                  }}
                  isSearchable={true}
                  placeholder="Select Service Options"
                />
                <h1 className=" text-2xl font-medium">Services</h1>
                <ul className="list-disc mx-5">
                  {services.map((service) => {
                    return <li key={service}>{service}</li>;
                  })}
                </ul>
              </BorderBox>

              <BorderBox>
                <Select
                  id="complex_needs"
                  value={generateSelectDefault(complexNeedsSupported)}
                  isMulti
                  instanceId="complex_needs"
                  name="complex_needs"
                  options={complexNeedsSupportedOptions}
                  className="basic-multi-select mb-4"
                  onChange={(val) => {
                    const data = val.map((d: any) => d.value);
                    setComplexNeedsSupported(data);
                  }}
                  isSearchable={true}
                  placeholder="Select complex need options "
                />
                <h1 className=" text-2xl font-medium">
                  Complex Needs Supported
                </h1>
                <ul className="list-disc mx-5">
                  {complexNeedsSupported.map((cNeeds) => {
                    return <li key={cNeeds}>{cNeeds}</li>;
                  })}
                </ul>
              </BorderBox>

              <BorderBox>
                <h1 className=" text-2xl font-medium  mb-4">
                  Additional Information
                </h1>

                <Select
                  id="gender"
                  value={generateSelectDefault(genderOfAttendants)}
                  isMulti
                  instanceId="gender"
                  name="gender"
                  options={genderOfAttendanceOptions}
                  className="basic-multi-select mb-4"
                  onChange={(val) => {
                    const data = val.map((d: any) => d.value);
                    setGenderOfAttendants(data);
                  }}
                  isSearchable={true}
                  placeholder="Select Genders of Attendance"
                  classNamePrefix="select"
                />

                <h1 className=" text-2xl font-medium mb-2">
                  Gender of attendants
                </h1>
                <ul className="list-disc mx-5 mb-4">
                  {genderOfAttendants.map((gen) => {
                    return <li key={gen}>{gen}</li>;
                  })}
                </ul>

                <Select
                  id="Languages"
                  value={generateSelectDefault(languages)}
                  isMulti
                  instanceId="Languages"
                  name="Languages"
                  options={selectLanguages}
                  className="basic-multi-select mb-4"
                  onChange={(val) => {
                    const data = val.map((d: any) => d.value);
                    setLanguages(data);
                  }}
                  isSearchable={true}
                  placeholder="Select Languages"
                  classNamePrefix="select"
                />
                <h1 className=" text-2xl font-medium mb-2">Languages</h1>
                <ul className="list-disc mx-5 mb-4">
                  {languages.map((lan) => {
                    return <li key={lan}>{lan}</li>;
                  })}
                </ul>
              </BorderBox>
            </div>

            {/* //! Right side */}
            <div className="mt-4 md:mt-0 col-span-full md:col-span-3 flex flex-col gap-4 md:gap-6">
              <BorderBox>
                <h1 className=" text-2xl font-medium">Contacts</h1>
                <div className="">
                  <div className="mt-2">
                    <CustomInput
                      onChange={(e) => setWebsite(e.target.value)}
                      value={website}
                      type="text"
                      name="website"
                      id="website"
                      autoComplete="website"
                      placeholder="Business Website"
                    />
                  </div>
                  <div className="mt-2">
                    <CustomInput
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="phone"
                      placeholder="Contact Number"
                    />
                  </div>

                  <div className="mt-2">
                    <CustomInput
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      type="text"
                      name="email"
                      id="email"
                      autoComplete="email"
                      placeholder="Contact email"
                    />
                  </div>
                  <div className="mt-2">
                    <CustomInput
                      onChange={(e) => setFacebook(e.target.value)}
                      value={facebook}
                      type="text"
                      name="facebook"
                      id="facebook"
                      autoComplete="facebook"
                      placeholder="Facebook profile url"
                    />
                  </div>
                  <div className="mt-2">
                    <CustomInput
                      onChange={(e) => setTwitter(e.target.value)}
                      value={twitter}
                      type="text"
                      name="twitter"
                      id="twitter"
                      autoComplete="twitter"
                      placeholder="X Profile url"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-2 items-center flex-wrap">
                  {website ? (
                    <>
                      <MousePointerClick size={16} />
                      <Link
                        target="_blank"
                        href={
                          website.startsWith("https://")
                            ? website
                            : `https://${website}`
                        }
                      >
                        Visit Website
                      </Link>
                    </>
                  ) : null}

                  {phone ? (
                    <>
                      <Phone size={16} />
                      <Link href={`tel:${phone}`}>{phone}</Link>
                    </>
                  ) : null}
                  {email ? (
                    <div className="flex gap-1 items-center">
                      <Mail size={16} />
                      <Link href={`mailto:${email}`}>{email}</Link>
                    </div>
                  ) : null}
                  {facebook ? (
                    <>
                      <FacebookIcon size={16} />
                      <Link
                        target="_blank"
                        href={
                          facebook.startsWith("https://")
                            ? facebook
                            : `https://${facebook}`
                        }
                      >
                        Facebook
                      </Link>
                    </>
                  ) : null}
                  {twitter ? (
                    <>
                      <Image src="/xlogo.svg" width={12} height={12} alt="X" />
                      <Link
                        target="_blank"
                        href={
                          twitter.startsWith("https://")
                            ? twitter
                            : `https://${twitter}`
                        }
                      >
                        X Account
                      </Link>
                    </>
                  ) : null}
                </div>
              </BorderBox>
              <BorderBox>
                <Select
                  id="delivery_options"
                  value={generateSelectDefault(deliveryOptions)}
                  isMulti
                  instanceId="delivery"
                  name="delivery"
                  options={selectDeliveryOptions}
                  className="basic-multi-select mb-4"
                  onChange={(val) => {
                    const data = val.map((d: any) => d.value);
                    setDeliveryOptions(data);
                  }}
                  isSearchable={true}
                  placeholder="Select delivery options"
                  classNamePrefix="select"
                />
                <h1 className=" text-2xl font-medium">Delivery Options</h1>
                <div className="flex flex-col">
                  {deliveryOptions.map((option) => {
                    return (
                      <div key={option}>
                        <div className="flex gap-2 items-center">
                          {option === "Online/Telehealth" ? (
                            <Globe size={16} />
                          ) : option === "Mobile" ? (
                            <CarFront size={16} />
                          ) : (
                            <PersonStanding size={16} />
                          )}
                          {option}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </BorderBox>
              <BorderBox>
                <ServiceLocationInput
                  data={serviceLocations}
                  setData={setServiceLocations}
                />
              </BorderBox>
              <BorderBox>
                <Select
                  id="ages_supported"
                  value={generateSelectDefault(agesSupported)}
                  isMulti
                  instanceId="ages_supported"
                  name="ages_supported"
                  options={agesSupportedOptions}
                  className="basic-multi-select mb-4"
                  onChange={(val) => {
                    const data = val.map((d: any) => d.value);
                    setAgesSupported(data);
                  }}
                  isSearchable={true}
                  placeholder="Select Ages Supported"
                  classNamePrefix="select"
                />
                <h1 className=" text-2xl font-medium">Ages Supported</h1>
                <ul className="list-disc ml-5 mt-2">
                  {agesSupported.map((ages) => {
                    return <li key={ages}>{ages}</li>;
                  })}
                </ul>
              </BorderBox>
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

export default CreateList;
