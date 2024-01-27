import SignIn from "@/components/SignIn";
// import SignUp from "@/components/SignUp";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";

const Register = async () => {
  const session = await getAuthSession();
  if (session && session.user) {
    redirect("/directory");
  }
  return (
    <div>
      <SignIn />
    </div>
  );
};

export default Register;
