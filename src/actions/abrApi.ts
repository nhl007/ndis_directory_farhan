"use server";

import { AbnLookupResult } from "@/types/business";

const apiUrl = process.env.ABR_LOOKUP_URL;
const guid = process.env.ABR_GUID;

export async function searchValidABN(abn: string) {
  if (!abn || abn.length < 5) {
    return null;
  }
  try {
    let stripped = abn.replace(/\s/g, "");
    const response = await fetch(`${apiUrl}?abn=${stripped}&guid=${guid}`);

    const text = await response.text();

    const data: AbnLookupResult = JSON.parse(
      text.replace(/^callback\(|\)$/g, "")
    );

    if (
      data.Abn === "" ||
      data.AddressPostcode === "" ||
      data.AddressState === ""
    ) {
      return null;
    }

    if (data.BusinessName.length <= 0) {
      if (data.EntityTypeCode === "IND") {
        data.BusinessName = data.EntityName.split(", ").reverse();
      } else {
        data.BusinessName[0] = data.EntityName;
      }
    } else {
      data.BusinessName = [data.BusinessName[0]];
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return null;
  }
}
