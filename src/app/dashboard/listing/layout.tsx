import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";
import BusinessListingTabs from "@/components/BusinessListingTabs";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession();
  if (!session) {
    return redirect("/directory");
  }
  return (
    <div className="border-b border-gray-900/10 pb-4 md:pb-6">
      <h1 className="text-lg font-semibold leading-7 text-gray-900">
        Business Listing
      </h1>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Please fill the following details to list your business in the
        directory.
      </p>
      <BusinessListingTabs key="listing lay" />
      {children}
    </div>
  );
};

export default layout;
