export type errorResponse = {
  data: null;
  message: string;
};

export interface BusinessSearchParams {
  searchParams: {
    keyword: string;
    radius: string;
    postalCode: string;
    category: string;
    ndis: string;
    disabilityExp: string;
    delivery: string;
    age: string;
    languages: string;
    other: string;
    payment: string;
    autism: string;
    complexNeeds: string;
  };
}
export type SearchParamsActions = {
  keyword: string;
  radius: string;
  postalCode: string;
  category: string;
  ndis: string;
  disabilityExp: string;
  delivery: string;
  age: string;
  languages: string;
  other: string;
  payment: string;
  autism: string;
  complexNeeds: string;
};
