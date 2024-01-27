"use client";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { SetStateAction, useState } from "react";
import CustomButton from "./ui/CustomButton";
import {
  agesSupportedOptions,
  complexNeedsSupportedOptions,
  disabilitiesExperienceOptions,
  genderOfAttendanceOptions,
  otherProviderSkillsOptions,
  selectDeliveryOptions,
  selectLanguages,
  selectPaymentOptions,
} from "@/constants/constants";
import { BusinessSearchParams } from "@/types/common";
import { useRouter } from "next/navigation";

const RefineResults = ({ searchParams }: BusinessSearchParams) => {
  // useEffect(()=>{
  //   for (const [key, value] of Object.entries(searchParams)) {
  //   if(value){
  //     if(key ==='ndis'){

  //     }
  //   }
  //   }
  // },[])

  const router = useRouter();

  const [ndis, setNdis] = useState(false);
  const [disabilityExperience, setDisabilityExperience] = useState<string[]>(
    []
  );
  const [delivery, setDelivery] = useState<string[]>([]);
  const [age, setAge] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [complexNeeds, setComplexNeeds] = useState<string[]>([]);
  const [other, setOther] = useState<string[]>([]);
  const [payment, setPayment] = useState<string[]>([]);
  const [autism, setAutism] = useState(false);

  const refineResults = () => {
    const urlObj = {
      ...searchParams,
      ndis: ndis,
      disabilityExp: disabilityExperience,
      delivery: delivery,
      age: age,
      languages: languages,
      other: other,
      payment: payment,
      autism: autism,
      complexNeeds: complexNeeds,
    };

    let url = "/directory/s?";

    for (const [key, value] of Object.entries(urlObj)) {
      // if (typeof value === "boolean" && value) {
      //   url = url + key + "=" + JSON.stringify(value) + "&";
      // } else if (Array.isArray(value) && value.length > 0) {
      //   url = url + key + "=" + value + "&";
      // } else {
      // }
      url = url + key + "=" + value + "&";
    }
    router.push(url);
  };

  const handleCheckboxChange = (
    value: string,
    prev: string[],
    setData: React.Dispatch<SetStateAction<string[]>>
  ) => {
    if (prev.includes(value)) {
      setData(prev.filter((item) => item !== value));
    } else {
      setData([...prev, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <CustomDropdown name="NDIS Registered">
        <label>
          <input
            className=" mr-3"
            onChange={(e) => setNdis((prev) => !prev)}
            type="checkbox"
            checked={ndis}
          />
          NDIS Registered Only
        </label>
      </CustomDropdown>
      <CustomDropdown name="Disabilities Experience">
        {disabilitiesExperienceOptions.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(
                    e.target.value,
                    disabilityExperience,
                    setDisabilityExperience
                  )
                }
                type="checkbox"
                checked={disabilityExperience.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>
      <CustomDropdown name="Service Delivery">
        {selectDeliveryOptions.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(e.target.value, delivery, setDelivery)
                }
                type="checkbox"
                checked={delivery.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>
      <CustomDropdown name="Ages Supported">
        {agesSupportedOptions.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(e.target.value, age, setAge)
                }
                type="checkbox"
                checked={age.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>
      <CustomDropdown name="Languages">
        {selectLanguages.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(e.target.value, languages, setLanguages)
                }
                type="checkbox"
                checked={languages.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>
      <CustomDropdown name="Gender of Attendants">
        {genderOfAttendanceOptions.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(e.target.value, gender, setGender)
                }
                type="checkbox"
                checked={gender.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>
      <CustomDropdown name="Complex needs supported">
        {complexNeedsSupportedOptions.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(
                    e.target.value,
                    complexNeeds,
                    setComplexNeeds
                  )
                }
                type="checkbox"
                checked={complexNeeds.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>
      <CustomDropdown name="Other Provider Skills">
        {otherProviderSkillsOptions.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(e.target.value, other, setOther)
                }
                type="checkbox"
                checked={other.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>

      <CustomDropdown name="Autism Provider">
        <label>
          <input
            className=" mr-3"
            onChange={() => setAutism((prev) => !prev)}
            type="checkbox"
            checked={autism}
          />
          Autism Provider
        </label>
      </CustomDropdown>
      <CustomDropdown name="Payment Type">
        {selectPaymentOptions.map((value, index) => {
          return (
            <div className="flex gap-2" key={index}>
              <input
                id={value.value}
                onChange={(e) =>
                  handleCheckboxChange(e.target.value, payment, setPayment)
                }
                type="checkbox"
                checked={payment.includes(value.value)}
                value={value.value}
              />
              <label htmlFor={value.value} className=" text-sm font-medium">
                {value.label}
              </label>
            </div>
          );
        })}
      </CustomDropdown>
      <div className="flex gap-4 mt-6">
        <CustomButton className="text-sm" onClick={refineResults}>
          Apply
        </CustomButton>
        <CustomButton className="text-sm bg-btn-orange">Clear</CustomButton>
      </div>
    </div>
  );
};

export default RefineResults;
