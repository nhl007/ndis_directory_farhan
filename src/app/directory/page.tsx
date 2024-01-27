import { getFeaturedBusiness } from "@/actions/businessActions";
import FeaturedBusinessCard from "@/components/FeaturedBusiness";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { BusinessDatabaseModel } from "@/types/business";
import Link from "next/link";

const page = async () => {
  const resp = await getFeaturedBusiness();
  if (!resp) return null;

  const data: Pick<
    BusinessDatabaseModel,
    | "BusinessName"
    | "blurb"
    | "serviceLocations"
    | "EntityTypeCode"
    | "_id"
    | "rank"
    | "image"
    | "ndis_registered"
  >[] = await JSON.parse(resp);

  return (
    <div className=" my-6 md:my-8">
      <MaxWidthWrapper>
        <div className=" grid grid-flow-row grid-cols-1 md:grid-cols-4 place-items-center md:gap-x-7 gap-y-6 md:gap-y-7">
          {data.map((b, i) => {
            return (
              <Link className="col-span-1" key={i} href={`/business/${b._id}`}>
                <FeaturedBusinessCard
                  blurb={b.blurb}
                  image={b.image?.card}
                  name={b.BusinessName.join(" ")}
                  businessType={b.EntityTypeCode}
                  rank={b.rank}
                  serviceLocations={b.serviceLocations}
                  ndisRegistered={b.ndis_registered}
                />
              </Link>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
