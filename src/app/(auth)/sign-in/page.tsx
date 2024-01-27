import SignIn from "@/components/SignIn";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";

interface ISearchParamsSSO {
  searchParams: {
    sso: string;
    sig: string;
  };
}

const Login = async ({ searchParams }: ISearchParamsSSO) => {
  const session = await getAuthSession();
  if (session && session.user) {
    redirect("/directory");
  }

  return (
    <div className="w-full h-full">
      <SignIn sso={searchParams.sso} sig={searchParams.sig} />
    </div>
  );
};

export default Login;
