import { searchBusinesses } from "@/actions/businessActions";
import FeaturedBusinessCard from "@/components/FeaturedBusiness";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { BusinessDatabaseModel } from "@/types/business";
import { BusinessSearchParams } from "@/types/common";
import Link from "next/link";

const page = async ({ searchParams }: BusinessSearchParams) => {
  let data: Pick<
    BusinessDatabaseModel,
    | "BusinessName"
    | "blurb"
    | "serviceLocations"
    | "EntityTypeCode"
    | "_id"
    | "rank"
    | "image"
    | "ndis_registered"
  >[] = [];

  const resp = await searchBusinesses(searchParams);

  if (resp) {
    data = await JSON.parse(resp);
  }

  return (
    <div className=" my-6 md:my-10">
      <MaxWidthWrapper>
        <div>
          {/* <div className="grid grid-flow-row md:grid-flow-col md:gap-x-2"> */}
          {/* <div className="md:col-span-1 col-span-3 pr-8 w-full md:w-[300px]">
            <h1 className="text-xl font-semibold  border-b-2 pb-3">
              Refine Results
            </h1>
            <div>
              <RefineResults searchParams={searchParams} />
            </div>
          </div> */}
          {data.length ? (
            <>
              <p className="font-medium mb-4">
                Total {data.length} results found
              </p>
              <div className="grid grid-flow-row grid-cols-1 md:grid-cols-4 place-items-center md:gap-x-7 gap-y-4 md:gap-y-7">
                {data.map((b, i) => {
                  return (
                    <Link
                      className="col-span-1"
                      key={i}
                      href={`/business/${b._id}`}
                    >
                      <FeaturedBusinessCard
                        blurb={b.blurb}
                        name={b.BusinessName.join(" ")}
                        businessType={b.EntityTypeCode}
                        rank={b.rank}
                        serviceLocations={b.serviceLocations}
                        image={b.image?.card}
                        ndisRegistered={b.ndis_registered}
                      />
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="col-span-3">
              <p className=" text-3xl">
                No results? Let our connection team help you!
              </p>
              <p>We did not find a perfect match using your requirements.</p>
              <p>
                Let our connections team help you find the services you need.
              </p>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
