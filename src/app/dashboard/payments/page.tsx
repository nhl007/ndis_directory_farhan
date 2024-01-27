"use client";

import CustomButton from "@/components/ui/CustomButton";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import { getStripeCheckoutSession } from "@/libs/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Payments = () => {
  const params = useSearchParams().get("success");

  const { displayAlert } = useFeatureContext();
  const makePayments = async () => {
    const stripe = await loadStripe(
      "pk_test_51LnY5xGihEKbM8YE9AzKbGeJUKuszjGhwJFHGviRlrRXlDteHNGAPrnIcVQ0qvLfSOXZimjk9IhGK123OrmZz2XO0061QFF3PN"
    );

    const session = await getStripeCheckoutSession();

    if (session) {
      displayAlert("Success! Redirecting...", true);
      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });
      if (result?.error) {
        displayAlert("Error Occurred! Try Again", false);
      }
    } else {
      displayAlert("Error Occurred! Try Again", false);
    }
  };

  return (
    <div className=" flex justify-center items-center">
      {params ? (
        <div className=" w-[500px] h-[400px] flex gap-6 shadow-lg justify-center items-center flex-col rounded-lg py-10">
          <h1 className=" text-4xl font-semibold text-green-400">
            Payment Successful
          </h1>
          <CheckCircleIcon className="text-green-400" size={150} />
        </div>
      ) : (
        <div className="flex flex-col gap-6 shadow-lg px-10 py-6 rounded-lg">
          <h1 className=" text-4xl font-semibold">Make Payments</h1>
          <p>
            Subscription Fee : 250$ <br></br>
            <span>**every 3 months</span>
          </p>

          <CustomButton onClick={makePayments}>Subscribe</CustomButton>
        </div>
      )}
    </div>
  );
};

export default Payments;
