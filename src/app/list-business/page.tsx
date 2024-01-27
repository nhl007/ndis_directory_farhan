import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getAuthSession } from "@/libs/auth";
import Link from "next/link";

const page = async () => {
  const session = await getAuthSession();
  return (
    <MaxWidthWrapper>
      <h1 className=" text-2xl font-semibold mb-6">
        We&apos;re More Than Just Another NDIS Directory
      </h1>

      <p>
        Most directories offer a static experience - you create a listing and
        then, it just sits there. That&apos;s not us. At our NDIS-focused
        directory, you&apos;re in the driver&apos;s seat. Control your
        visibility, engage directly with the community, and give your NDIS
        business the exposure it deserves.
      </p>

      <h1 className=" text-2xl font-semibold my-6">Why Choose Our Platform?</h1>

      <div className=" mb-8">
        <ul className="list-disc pl-6">
          <li>
            Direct Control Over Visibility: Your activity on the forum directly
            influences your ranking in the directory. The more you participate
            and provide value in forum discussions, the more visible your
            business becomes.
          </li>
          <li>
            Engage with NDIS Participants and Supporters: This isn&apos;t just
            about listings; it&apos;s about connections. You&apos;ll have the
            unique opportunity to directly liaise with NDIS participants and
            their support networks, answering questions, offering insights, and
            making impactful impressions.
          </li>
          <li>
            Customizable Post Signature: Make every forum post count. Showcase
            your business with a custom banner in your signature, linked
            directly to your directory profile. It&apos;s visibility with every
            interaction.
          </li>
        </ul>
      </div>

      <Link
        className={` ${
          session?.user && session.user.id ? " hidden" : ""
        } text-xl font-semibold py-2 px-5 bg-black text-white rounded-md`}
        href={session?.user && session.user.id ? "/dashboard" : "/sign-up"}
      >
        Get Started Now
      </Link>

      <p className=" mt-8">
        List your business today and tap into a dynamic platform where you
        control your visibility and directly engage with the NDIS community. If
        you already have a forum account, simply sign in to pre-populate your
        details and get your business noticed.
      </p>
    </MaxWidthWrapper>
  );
};

export default page;
