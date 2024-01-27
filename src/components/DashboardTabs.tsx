"use client";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import {
  ActivityIcon,
  BriefcaseIcon,
  CircleDollarSignIcon,
  HelpingHandIcon,
  PersonStandingIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Alert from "./Alert";

const DashboardTabs = () => {
  const {
    state: { showAlert },
  } = useFeatureContext();

  const url = usePathname();

  return (
    <div className="border-b border-gray-200 mb-4 md:mb-6">
      {showAlert && <Alert />}
      <div className="flex flex-wrap -mb-px md:text-md text-sm font-semibold text-center text-gray-500 gap-2 md:gap-6 ">
        <div>
          <Link
            href="/dashboard/listing"
            className="me-2 inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg"
          >
            <BriefcaseIcon />
            Create/Edit Business Listing
          </Link>
        </div>
        <div
          className={`${
            url === "/dashboard" && "text-btn-orange"
          } me-2 hover:text-btn-orange`}
        >
          <Link
            href="/dashboard"
            className="me-2 inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg"
          >
            <PersonStandingIcon />
            Profile/Account Settings
          </Link>
        </div>
        <div
          className={`${
            url === "/dashboard/payments" && "text-btn-orange"
          } me-2 hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/payments"
            className="me-2 inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg"
          >
            <CircleDollarSignIcon />
            Billing/Payments
          </Link>
        </div>
        <div
          className={`${
            url === "/dashboard/analytics" && "text-btn-orange"
          } me-2 hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/analytics"
            className="me-2 inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg"
          >
            <ActivityIcon />
            Analytics
          </Link>
        </div>
        <div
          className={`${
            url === "/dashboard/support" && "text-btn-orange"
          } me-2 hover:text-btn-orange`}
        >
          <Link
            href="/dashboard/support"
            className="me-2 inline-flex gap-2 items-center justify-center md:pr-4 py-4 border-b-2 border-transparent rounded-t-lg"
          >
            <HelpingHandIcon />
            Support/Help Centre
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
