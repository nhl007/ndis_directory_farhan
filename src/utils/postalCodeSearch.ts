"use server";

import fs from "fs";
import csv from "csv-parser";
import path from "path";

type postCodeResult = {
  postcode: string;
  place_name: string;
  state_name: string;
  state_code: string;
  latitude: string;
  longitude: string;
  accuracy: string;
};

async function getAuPostCodeDetails(
  searchBy: string,
  value: string
): Promise<postCodeResult[] | null> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "au_postcodes.csv"
  );

  return new Promise((resolve, reject) => {
    const results: postCodeResult[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data[searchBy] === value) {
          results.push(data);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        console.log(error);
        reject(null);
      });
  });
}

async function getAuPostCodeDetailsWithStrings(
  suburb: string,
  postcode: string
): Promise<postCodeResult[] | null> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "au_postcodes.csv"
  );

  return new Promise((resolve, reject) => {
    const results: postCodeResult[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data["postcode"] === postcode && data["place_name"] === suburb) {
          results.push(data);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        console.log(error);
        reject(null);
      });
  });
}

export const getLatLngByPostalCode = async (postCode: string | number) => {
  const data = await getAuPostCodeDetails("postcode", String(postCode));

  if (data) {
    return [Number(data[0].longitude), Number(data[0].latitude)];
  } else return null;
};

export const getLatLngBySuburbs = async (suburb: string) => {
  const data = await getAuPostCodeDetails("place_name", suburb);

  if (data) {
    return [Number(data[0].longitude), Number(data[0].latitude)];
  } else return null;
};

export const getLatLngBySuburbsAndPostCode = async (
  suburb: string,
  postcode: string
) => {
  const data = await getAuPostCodeDetailsWithStrings(suburb, postcode);

  if (data) {
    return [Number(data[0].longitude), Number(data[0].latitude)];
  } else return null;
};

export const getSuburbsByState = async (state: string) => {
  const data = await getAuPostCodeDetails("state_code", state);

  if (data) {
    if (data && data.length) {
      const suburbs = data.map((data) => {
        return {
          label: data.place_name + " " + data.postcode,
          value: data.place_name + " " + data.postcode,
        };
      });
      return suburbs;
    }
  } else return null;
};

async function getAuPostCodeSuggestions(
  value: string
): Promise<postCodeResult[] | null> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "au_postcodes.csv"
  );

  return new Promise((resolve, reject) => {
    const results: postCodeResult[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        const condition = String(data["postcode"] + data["place_name"])
          .toLocaleLowerCase()
          .includes(value);
        if (condition) {
          results.push(data);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        console.log(error);
        reject(null);
      });
  });
}

export const getPostalCodeSuggestion = async (postcode: string) => {
  if (postcode.length < 2) {
    return null;
  }
  const data = await getAuPostCodeSuggestions(postcode.toLocaleLowerCase());

  if (data) {
    if (data && data.length) {
      const codes = data.map((data) => {
        // return {label:data.postcode + " | " + data.place_name}
        return data.postcode + " | " + data.place_name;
      });
      return codes;
    }
  } else return null;
};
