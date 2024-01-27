"use client";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import {
  BadgeCheckIcon,
  BookUserIcon,
  BriefcaseIcon,
  FileSignatureIcon,
  LandmarkIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Alert from "./Alert";

const BusinessListingTabs = () => {
  const {
    state: { showAlert },
  } = useFeatureContext();

  const url = usePathname();

  return (
    <div className="border-b border-gray-200 mb-4 md:mb-6">
      {showAlert && <Alert />}
      <div className="flex flex-wrap -mb-px md:text-md text-sm font-semibold text-center text-gray-500 gap-2 md:gap-6 ">
        <div
          className={`${
            url === "/dashboard/listing" && "text-btn-orange"
          } me-2 hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/listing"
            className="me-2 inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg"
          >
            <BriefcaseIcon />
            Abn LookUp
          </Link>
        </div>
        <div
          className={`me-2 ${
            url === "/dashboard/listing/page" && "text-btn-orange"
          } 
             hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/listing/page"
            // aria-disabled={exists}
            // tabIndex={!exists ? -1 : undefined}
            className="inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg "
          >
            <LandmarkIcon />
            Business Page
          </Link>
        </div>
        <div
          className={`me-2 ${
            url === "/dashboard/listing/card" && "text-btn-orange"
          }    hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/listing/card"
            // aria-disabled={exists}
            // tabIndex={!exists ? -1 : undefined}
            className="inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg "
          >
            <BookUserIcon />
            Listing Card
          </Link>
        </div>
        <div
          className={`me-2 ${
            url === "/dashboard/listing/verify" && "text-btn-orange"
          }    hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/listing/verify"
            // aria-disabled={exists}
            // tabIndex={!exists ? -1 : undefined}
            className="inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg "
          >
            <BadgeCheckIcon />
            Verify NDIS Registration
          </Link>
        </div>
        <div
          className={`me-2 ${
            url === "/dashboard/listing/signature" && "text-btn-orange"
          }  hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/listing/signature"
            // aria-disabled={exists}
            // tabIndex={!exists ? -1 : undefined}
            className="inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg "
          >
            <FileSignatureIcon />
            Forum Signature
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessListingTabs;
