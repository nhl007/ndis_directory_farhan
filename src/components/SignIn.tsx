"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomButton from "./ui/CustomButton";
import { useRouter } from "next/navigation";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import Alert from "./Alert";
import Link from "next/link";
import { generateDiscourseAuthUrl } from "@/actions/userActions";
import { usePathname } from "next/navigation";

const SignIn = ({ sso, sig }: { sso?: string; sig?: string }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    displayAlert,
    state: { showAlert },
  } = useFeatureContext();

  const router = useRouter();

  const getUrlAndRedirect = async () => {
    setLoading(true);
    const url = await generateDiscourseAuthUrl();
    setLoading(false);
    router.push(url);
  };

  const logInUser = async () => {
    setLoading(true);

    if (sso && sig) {
      await signIn("credentials", {
        sso: sso,
        sig: sig,
        redirect: false,
      })
        .then((res) => {
          if (res?.ok) {
            return router.back();
          } else {
            if (res?.error) {
              displayAlert(res?.error, false);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          displayAlert("Error Occurred !", false);
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sso && sig) {
      logInUser();
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" flex gap-6 flex-col justify-center items-center px-8">
      {showAlert && <Alert />}
      <h1 className=" text-4xl font-semibold text-center">
        {pathname === "/sign-in" ? "Sign In" : "Sign Up"}
      </h1>
      <CustomButton
        onClick={getUrlAndRedirect}
        className=" w-full md:max-w-[500px] flex gap-2"
        isLoading={loading}
        disabled={loading}
      >
        <svg
          className=" w-10 h-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -1 104 106"
        >
          <path
            fill="#231f20"
            d="M51.87 0C23.71 0 0 22.83 0 51v52.81l51.86-.05c28.16 0 51-23.71 51-51.87S80 0 51.87 0Z"
          />
          <path
            fill="#fff9ae"
            d="M52.37 19.74a31.62 31.62 0 0 0-27.79 46.67l-5.72 18.4 20.54-4.64a31.61 31.61 0 1 0 13-60.43Z"
          />
          <path
            fill="#00aeef"
            d="M77.45 32.12a31.6 31.6 0 0 1-38.05 48l-20.54 4.7 20.91-2.47a31.6 31.6 0 0 0 37.68-50.23Z"
          />
          <path
            fill="#00a94f"
            d="M71.63 26.29A31.6 31.6 0 0 1 38.8 78l-19.94 6.82 20.54-4.65a31.6 31.6 0 0 0 32.23-53.88Z"
          />
          <path
            fill="#f15d22"
            d="M26.47 67.11a31.61 31.61 0 0 1 51-35 31.61 31.61 0 0 0-52.89 34.3l-5.72 18.4Z"
          />
          <path
            fill="#e31b23"
            d="M24.58 66.41a31.61 31.61 0 0 1 47.05-40.12 31.61 31.61 0 0 0-49 39.63l-3.76 18.9Z"
          />
        </svg>
        <span>
          {pathname === "/sign-in" ? "Login" : "Register"} With Discourse
        </span>
      </CustomButton>

      <p className="mt-2">
        {pathname === "/sign-in"
          ? "Don't have an account?"
          : "Already have an account?"}
        {pathname === "/sign-in" ? (
          <Link className="text-blue-400 border-b-2 ml-1" href="/sign-up">
            Sign-Up
          </Link>
        ) : (
          <Link className="text-blue-400 border-b-2 ml-1" href="/sign-in">
            Sign-In
          </Link>
        )}
      </p>
    </div>
  );
};

export default SignIn;
