"use server";

import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";

import { stringifyResponse } from "../utils/utils";
import { getAuthSession } from "@/libs/auth";
import { connectToDB } from "@/libs/connectToDb";
import Business from "@/models/Business";
// import User from "@/models/User";
import { BusinessDatabaseModel, BusinessReviewData } from "@/types/business";
import { SearchParamsActions } from "@/types/common";
import { getLatLngBySuburbsAndPostCode } from "@/utils/postalCodeSearch";

export async function checkIfBusinessExists() {
  await connectToDB();
  const session = await getAuthSession();
  const id = session?.user.id;
  if (!id) return false;
  const doc = await Business.findOne({ user: id }).select("_id");
  noStore();
  if (doc && doc._id) {
    return true;
  } else return false;
}

async function getCoordinatesFromLocations(
  serviceLocations: BusinessDatabaseModel["serviceLocations"]
) {
  const locationCoordinates: {
    type: "Point";
    coordinates: number[] | null;
  }[] = [];

  if (serviceLocations?.length) {
    await Promise.all(
      serviceLocations.map(async (loc) => {
        if (loc.suburbs.length) {
          await Promise.all(
            loc.suburbs.map(async (sub) => {
              // const match = sub.match(/^([a-zA-Z\s]+)\s\d+$/);
              const match = sub.match(/^([a-zA-Z\s]+)\s(\d{4})$/);

              if (match) {
                const latLang = await getLatLngBySuburbsAndPostCode(
                  match[1],
                  match[2]
                );
                locationCoordinates.push({
                  type: "Point",
                  coordinates: latLang,
                });
              }
            })
          );
        }
      })
    );
  }

  return locationCoordinates;
}

export async function postBusinessData(data: Partial<BusinessDatabaseModel>) {
  const session = await getAuthSession();
  if (!session || !session.user)
    return { success: false, message: "Permission denied" };

  const id = session?.user.id;

  try {
    await connectToDB();
    const docId = await Business.findOne({ user: id }).select("_id");

    if (!docId) {
      if (data.serviceLocations?.length) {
        const coordinates = await getCoordinatesFromLocations(
          data.serviceLocations
        );
        await Business.create({
          user: id,
          discourseId: session.user.discourse_id,
          location: coordinates,
          ...data,
        });

        revalidatePath("/directory");

        return { success: true, message: "Saved Successfully !" };
      }
      await Business.create({
        user: id,
        discourseId: session.user.discourse_id,
        ...data,
      });
      revalidatePath("/directory");
      return { success: true, message: "Saved Successfully !" };
    } else {
      //! update logic

      if (data.serviceLocations?.length) {
        const coordinates = await getCoordinatesFromLocations(
          data.serviceLocations
        );

        await Business.findByIdAndUpdate(docId._id, {
          ...data,
          location: coordinates,
        }).select("_id");

        revalidatePath("/directory");
        return { success: true, message: "Saved Successfully !" };
      }

      await Business.findByIdAndUpdate(docId._id, {
        ...data,
      }).select("_id");

      revalidatePath("/directory");

      return { success: true, message: "Saved Successfully !" };
    }
  } catch (err: any) {
    if (err.code === 11000) {
      return { success: false, message: "Abn Already Exists!" };
    }

    if (err instanceof Error) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Error Ocurred" };
  }
}

//? query to search business
const constructQuery = async (
  searchParams: SearchParamsActions,
  radius: number
) => {
  noStore();
  const query: Record<string, any> = {};

  query.abnVerified = true;

  for (const [key, value] of Object.entries(searchParams)) {
    // console.log(key, ":", value);
    if (value) {
      if (key === "postalCode" && value.length > 2) {
        const loc = value.split(" | ");

        const postalCoordinates = await getLatLngBySuburbsAndPostCode(
          loc[1],
          loc[0]
        );

        if (postalCoordinates) {
          query.location = {
            $geoWithin: {
              $centerSphere: [
                [postalCoordinates[0], postalCoordinates[1]],
                radius / 6371,
              ],
            },
          };
        }
      }

      if (key === "keyword") {
        query.BusinessName = {
          $in: [new RegExp(value, "i")],
        };
      }

      if (key === "category") {
        // If category is provided
        query.services = {
          $in: [new RegExp(value, "i")],
        };
      }
      if (key === "delivery") {
        query.deliveryOptions = {
          $in: value.split(","),
        };
      }
      if (key === "age") {
        query.agesSupported = {
          $in: value.split(","),
        };
      }
      if (key === "languages") {
        query.languages = {
          $in: value.split(","),
        };
      }
      if (key === "gender") {
        query.genderOfAttendants = {
          $in: value.split(","),
        };
      }
      if (key === "complexNeeds") {
        query.complexNeedsSupported = {
          $in: value.split(","),
        };
      }

      if (key === "ndis" && value === "true") {
        query.ndis_registered = true;
      }

      if (key === "company" && value === "true") {
        query.EntityTypeCode = {
          $nin: [new RegExp("IND", "i")],
        };
      }

      if (key === "trader" && value === "true") {
        query.EntityTypeCode = {
          $in: [new RegExp("IND", "i")],
        };
      }
    }
  }

  return query;
};

export async function searchBusinesses(searchParams: SearchParamsActions) {
  try {
    await connectToDB();

    const query = await constructQuery(searchParams, 20);

    let doc = await Business.find(query)
      .select(
        "_id BusinessName blurb rank serviceLocations EntityTypeCode ndis_registered image"
      )
      .sort({ rank: "asc" });

    if (doc.length <= 0 && searchParams.postalCode) {
      const newQuery = await constructQuery(searchParams, 50);

      doc = await Business.find(newQuery)
        .select(
          "_id BusinessName blurb rank serviceLocations EntityTypeCode ndis_registered image"
        )
        .sort({ rank: "asc" });
    }

    if (doc.length > 0) {
      const sorted = doc.sort((a, b) => {
        if (a.rank === 0 && b.rank !== 0) {
          return 1;
        } else if (a.rank !== 0 && b.rank === 0) {
          return -1;
        } else {
          return a.rank - b.rank;
        }
      });
      revalidatePath("/directory/s");
      return stringifyResponse(sorted);
    } else {
      revalidatePath("/directory/s");

      return null;
    }
  } catch (error) {
    revalidatePath("/directory/s");
    console.error("Error searching businesses:", error);
    return null;
  }
}

type DBKeys = keyof BusinessDatabaseModel;

export async function getBusiness(fields: Partial<DBKeys>[]) {
  const session = await getAuthSession();

  const id = session?.user.id;

  if (!id) return stringifyResponse({ data: null, message: "no permission" });

  try {
    await connectToDB();

    const doc = await Business.findOne({ user: id }).select(fields.join(" "));

    return stringifyResponse({ data: doc, message: "success" });
  } catch (err) {
    console.log(err);
    return stringifyResponse({ data: null, message: "error" });
  }
}

export async function getFeaturedBusiness() {
  noStore();
  try {
    await connectToDB();
    const doc = await Business.find({ abnVerified: true })
      .select(
        "_id BusinessName blurb rank serviceLocations EntityTypeCode image ndis_registered"
      )
      .sort({ rank: "asc" });

    if (doc.length > 0) {
      const sorted = doc.sort((a, b) => {
        if (a.rank === 0 && b.rank !== 0) {
          return 1;
        } else if (a.rank !== 0 && b.rank === 0) {
          return -1;
        } else {
          return a.rank - b.rank;
        }
      });
      return stringifyResponse(sorted);
    } else return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getBusinessById(id: string): Promise<string | null> {
  try {
    if (!id) return null;
    await connectToDB();
    const doc = await Business.findById(id).lean();
    if (doc) {
      return stringifyResponse(doc);
    } else return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateNdisVerification(id: string) {
  try {
    const buss = await Business.findByIdAndUpdate(
      id,
      {
        ndis_registered: true,
      },
      {
        new: true,
      }
    ).select("_id BusinessName");

    return stringifyResponse(buss);
  } catch (error) {
    return null;
  }
}
