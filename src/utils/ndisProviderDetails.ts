"use server";

import fs from "fs";
import csv from "csv-parser";
import path from "path";

type NdisProviderDetails = {
  name: string;
  email: string;
};

export async function getAuNdisProviderDetails(
  name: string
): Promise<NdisProviderDetails[] | null> {
  const filePath = path.join(process.cwd(), "src", "assets", "au_ndis.csv");

  return new Promise((resolve, reject) => {
    const results: NdisProviderDetails[] = [];

    const headers = [
      "Registered Provider Name",
      "Outlet Name",
      "Address",
      "Phone",
      "Email",
      "Website",
      "ABN",
      "Open Hours",
      "Profession",
      "Registration Group",
      "Head Office / Outlet",
      "Active Provider (payment received last 3 months)",
    ];

    fs.createReadStream(filePath)
      .pipe(csv({ headers }))
      .on("data", (data) => {
        if (String(data["ABN"]).toLocaleLowerCase().includes(name)) {
          results.push({
            name: data["Registered Provider Name"],
            email: data["Email"],
          });
        }
      })
      .on("end", () => {
        console.log("end");
        resolve([results[results.length - 1]]);
      })
      .on("error", (error) => {
        console.log(error);
        reject(null);
      });
  });
}
