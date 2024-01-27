import { updateNdisVerification } from "@/actions/businessActions";
import { decodeToken } from "@/libs/customJWTToken";
import { CheckCircleIcon, ChevronLeft, XCircle } from "lucide-react";
import Link from "next/link";

export interface ConfirmationSearchParams {
  searchParams: {
    token: string;
  };
}
const page = async ({ searchParams }: ConfirmationSearchParams) => {
  if (!searchParams.token) {
    return (
      <div className="flex justify-center items-center">
        <div className="  flex justify-center items-center flex-col rounded-lg shadow-lg py-10 px-20">
          <XCircle color="red" size={150} />
          <h1 className=" text-2xl"> Invalid Token</h1>
          <Link
            className=" mt-6 text-blue-400 flex items-center gap-1"
            href="/"
          >
            <ChevronLeft /> Home
          </Link>
        </div>
      </div>
    );
  }

  const decoded = await decodeToken(searchParams.token);

  if (!decoded) {
    return (
      <div className="flex justify-center items-center">
        <div className="  flex justify-center items-center flex-col rounded-lg shadow-lg py-10 px-20">
          <XCircle color="red" size={150} />
          <h1 className=" text-2xl"> Invalid Token</h1>
          <Link
            className=" mt-6 text-blue-400 flex items-center gap-1"
            href="/"
          >
            <ChevronLeft /> Home
          </Link>
        </div>
      </div>
    );
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  //! Token  expiration check
  if (decoded.exp && Number(decoded.exp) < currentTimestamp) {
    return (
      <div className="flex justify-center items-center">
        <div className="  flex justify-center items-center flex-col rounded-lg shadow-lg py-10 px-20">
          <XCircle color="red" size={150} />
          <h1 className=" text-2xl"> Token Expired</h1>
          <Link
            className=" mt-6 text-blue-400 flex items-center gap-1"
            href="/"
          >
            <ChevronLeft /> Home
          </Link>
        </div>
      </div>
    );
  }

  const response = await updateNdisVerification(decoded.id as string);
  if (response) {
    const data = JSON.parse(response);
    if (data._id) {
      return (
        <div className="flex justify-center items-center">
          <div className="  flex justify-center items-center flex-col rounded-lg shadow-lg py-10 px-20">
            <CheckCircleIcon color="green" size={150} />
            <h1 className=" text-2xl"> Congratulations</h1>
            <h1 className=" text-2xl">NDIS Verification Complete</h1>
            <Link
              className=" mt-6 text-blue-400 flex items-center gap-1"
              href="/"
            >
              <ChevronLeft /> Home
            </Link>
          </div>
        </div>
      );
    }
  }
};

export default page;
