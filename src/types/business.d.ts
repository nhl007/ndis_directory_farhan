export type AbnLookupResult = {
  Abn: string;
  AbnStatus: string;
  AbnStatusEffectiveFrom: string;
  Acn: string;
  AddressDate: string;
  AddressPostcode: string;
  AddressState: string;
  BusinessName: string[];
  EntityName: string;
  EntityTypeCode: string;
  EntityTypeName: string;
  Gst: string;
  location: [{ type: "Point"; coordinates: number[] }];
};

export type serviceAgeNames =
  | "Early Childhood (0-7 years)"
  | "Children (7-17 years)"
  | "Young People (18-21 years)"
  | "Adults (22-59 years)"
  | "Mature Age (60+ years)";

export type serviceLocationsType = { state: string; suburbs: string[] }[];

export type BusinessPersonalInfo = {
  abnVerified: boolean;
  ndis_registered: boolean;
  blurb: string;
  about: string;
  services: string[];
  deliveryOptions: string[];
  languages: string[];
  genderOfAttendants: string[];
  agesSupported: Array<serviceAgeNames>;
  complexNeedsSupported: string[];
  contact: {
    email: string;
    website: string;
    phone: string;
    facebook: string;
    twitter: string;
  };
  serviceLocations: serviceLocationsType;
  image: {
    banner?: string;
    card?: string;
    avatar?: string;
  };
};

export type BusinessReviews = {
  caption: string;
  description: string;
  rating: number;
  date: string;
  user: string;
}[];

export type BusinessDatabaseModel = AbnLookupResult &
  BusinessPersonalInfo & { _id: string; rank: number; rating: number };

type BusinessReviewData = {
  caption: string;
  description: string;
  rating: number;
  date: string;
  user: {
    username: string;
    _id: string;
  };
  _id: string;
};
