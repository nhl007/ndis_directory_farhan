import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";
import {
  CarFront,
  FacebookIcon,
  Globe,
  MailIcon,
  MousePointerClick,
  PersonStanding,
  Phone,
} from "lucide-react";
import BorderBox from "@/components/ui/BorderBox";
import { getBusinessById } from "@/actions/businessActions";
import { BusinessDatabaseModel } from "@/types/business";
import SmallVerificationBox from "@/components/ui/SmallVerificationBox";
import Link from "next/link";
import LocationDropdown from "@/components/LocationDropdown";
// import Reviews from "@/components/Reviews";

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: PageProps) => {
  const resp = await getBusinessById(params.id);
  if (resp === null) return <p>not found</p>;
  const data = JSON.parse(resp) as Partial<BusinessDatabaseModel>;

  return (
    <div>
      <MaxWidthWrapper>
        <div
          className={` h-[300px] bg-cover py-5 md:py-8 relative`}
          style={{
            backgroundImage: `url('${
              data?.image?.banner ? data?.image?.banner : "/image.webp"
            }')`,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              className="rounded-full w-[150px] h-[150px]  object-cover absolute bottom-[-70px] left-[50px]"
              width={120}
              height={120}
              priority={true}
              src={data.image?.avatar ? data.image.avatar : "/image.jpg"}
              alt="avatar"
            />
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl font-semibold max-w-full  line-clamp-2 mt-16 mb-6">
          {data.BusinessName?.length ? data.BusinessName.join(" ") : ""}
        </h1>
        <div className=" flex gap-3">
          <SmallVerificationBox className="w-fit my-4 bg-green-500 text-white">
            {data.EntityTypeCode === "IND" ? "Sole Trader" : "Organisation"}
          </SmallVerificationBox>

          {data.ndis_registered && (
            <SmallVerificationBox className="w-fit my-4 bg-yellow-500 text-white">
              Ndis-Registered
            </SmallVerificationBox>
          )}
        </div>
        <BorderBox className=" mb-6">
          <h1>Test Block</h1>
          <p>Total Points :{data.rating}</p>
          <p>Rank :{data.rank}</p>
        </BorderBox>
        <div className="grid md:grid-flow-col grid-cols-9 md:gap-x-6">
          {/* //! left side */}
          <div className="col-span-full md:col-span-6 flex flex-col gap-4 md:gap-6">
            {data.about && (
              <BorderBox>
                <h1 className=" text-2xl font-medium">About</h1>
                <div
                  className="aboutSectionClass"
                  dangerouslySetInnerHTML={{
                    __html: data.about ?? "<p>No description available</p>",
                  }}
                />
              </BorderBox>
            )}

            {data.services?.length ? (
              <BorderBox>
                <h1 className=" text-2xl font-medium">Services</h1>
                <ul className="list-disc mx-5">
                  {data.services.map((service) => {
                    return <li key={service}>{service}</li>;
                  })}
                </ul>
              </BorderBox>
            ) : null}
            {/* <BorderBox>
              <h1 className=" text-2xl font-medium">Services</h1>
            </BorderBox> */}
            <BorderBox>
              <h1 className=" text-2xl font-medium  mb-4">
                Additional Information
              </h1>

              {data.genderOfAttendants?.length ? (
                <>
                  <h1 className=" text-2xl font-medium mb-2">
                    Gender of attendants
                  </h1>
                  <ul className="list-disc mx-5 mb-4">
                    {data.genderOfAttendants.map((gen) => {
                      return <li key={gen}>{gen}</li>;
                    })}
                  </ul>
                </>
              ) : null}

              {data.languages?.length ? (
                <>
                  <h1 className=" text-2xl font-medium mb-2">Languages</h1>
                  <ul className="list-disc mx-5 mb-4">
                    {data.languages.map((lan) => {
                      return <li key={lan}>{lan}</li>;
                    })}
                  </ul>
                </>
              ) : null}
            </BorderBox>
          </div>

          {/* //! Right side */}
          <div className="mt-4 md:mt-0 col-span-full md:col-span-3 flex flex-col gap-4 md:gap-6">
            <BorderBox>
              <h1 className=" text-2xl font-medium">Contacts</h1>
              <div className="flex gap-2 mt-2 items-center flex-wrap">
                {data.contact?.website ? (
                  <>
                    <MousePointerClick size={16} />
                    <Link
                      target="_blank"
                      href={
                        data.contact.website.startsWith("https://")
                          ? data.contact.website
                          : `https://${data.contact.website}`
                      }
                    >
                      Visit Website
                    </Link>
                  </>
                ) : null}

                {data.contact?.phone ? (
                  <>
                    <Phone size={16} />
                    <Link href={`tel:${data.contact.phone}`}>
                      {data.contact.phone}
                    </Link>
                  </>
                ) : null}
                {data.contact?.email ? (
                  <div className="flex gap-1 items-center">
                    <MailIcon size={16} />
                    <Link href={`mailto:${data.contact?.email}`}>
                      {data.contact?.email}
                    </Link>
                  </div>
                ) : null}
                {data.contact?.facebook ? (
                  <>
                    <FacebookIcon size={16} />
                    <Link
                      target="_blank"
                      href={
                        data.contact.facebook.startsWith("https://")
                          ? data.contact.facebook
                          : `https://${data.contact.facebook}`
                      }
                    >
                      Facebook
                    </Link>
                  </>
                ) : null}
                {data.contact?.twitter ? (
                  <>
                    <Image src="/xlogo.svg" width={14} height={14} alt="X" />
                    <Link
                      target="_blank"
                      href={
                        data.contact.twitter.startsWith("https://")
                          ? data.contact.twitter
                          : `https://${data.contact.twitter}`
                      }
                    >
                      X Account
                    </Link>
                  </>
                ) : null}
              </div>
            </BorderBox>
            {data.deliveryOptions?.length ? (
              <BorderBox>
                <h1 className=" text-2xl font-medium">Delivery Options</h1>
                <div className="flex flex-col">
                  {data.deliveryOptions.map((option) => {
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
            ) : null}
            {data.serviceLocations?.length ? (
              <BorderBox>
                <h1 className=" text-2xl font-medium">Service Locations</h1>
                {data.serviceLocations.map((loc) => {
                  return (
                    <LocationDropdown
                      key={loc.state}
                      state={loc.state}
                      suburbs={loc.suburbs}
                      classNames="w-full mt-2"
                    />
                  );
                })}
              </BorderBox>
            ) : null}
            {data.agesSupported?.length ? (
              <BorderBox>
                <h1 className=" text-2xl font-medium">Ages Supported</h1>
                <ul className="list-disc ml-5 mt-2">
                  {data.agesSupported.map((ages) => {
                    return <li key={ages}>{ages}</li>;
                  })}
                </ul>
              </BorderBox>
            ) : null}
          </div>
        </div>
        {/* <Reviews
          total={data.totalReviews ? data.totalReviews}
          rating={data.rating}
          _id={params.id}
          reviewsData={data.reviews}
        /> */}
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
