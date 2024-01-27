import { User, UserPlus } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ProfileMenu from "./ProfileMenu";
import { getAuthSession } from "@/libs/auth";
// import MobileNav from "./MobileNavMenu";

const NavBar = async () => {
  // const { status } = useSession();
  const session = await getAuthSession();
  return (
    <MaxWidthWrapper>
      <nav className="flex flex-col relative font-semibold">
        <div className=" self-end flex items-center py-2 h-[40px]">
          {session?.user.id ? (
            <ProfileMenu
              name={session.user.name as string}
              email={session.user.email as string}
              image={session.user.image as string}
            />
          ) : (
            <div className="flex gap-4 items-center">
              <Link
                href="/sign-in"
                className="flex gap-1 items-center hover:text-btn-orange"
              >
                <User size={18} /> Login
              </Link>
              <Link
                href="/sign-up"
                className="flex gap-1 items-center hover:text-btn-orange"
              >
                <UserPlus size={18} /> Register
              </Link>
            </div>
          )}
        </div>
        <div className=" divide-solid border" />
        <div className="flex gap-3 md:gap-7 h-[48px] md:h-[84px] justify-start items-center">
          <Link className=" hover:text-btn-orange" href="/directory">
            Directory
          </Link>

          <Link className=" hover:text-btn-orange" href="/list-business">
            List Business
          </Link>
          {/* <MobileNav /> */}
        </div>
      </nav>
    </MaxWidthWrapper>
  );
};

export default NavBar;
