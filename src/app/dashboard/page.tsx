"use client";
import { updateUserDetails } from "@/actions/discourseApi";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { useFeatureContext } from "@/context/feature/FeatureContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { displayAlert } = useFeatureContext();
  const [loading, setLoading] = useState(false);
  const { data, status } = useSession();
  const [name, setName] = useState(data?.user.fullName as string);
  const [email, setEmail] = useState(data?.user.email as string);
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const setPreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = e.target.files?.[0];
    setFile(e.target.files?.[0] as File);
    const fileReader = new FileReader();
    if (fileData) {
      fileReader.readAsDataURL(fileData);
      fileReader.onloadend = async () => {
        setImage(fileReader.result as string);
      };
    }
  };

  const updateUserProfile = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!name && !file && !email) {
      setLoading(false);
      return displayAlert("Nothing to update!", false);
    }
    const formData = new FormData();
    if (name) {
      formData.append("name", name);
    }
    if (email) {
      formData.append("email", email);
    }
    if (file) {
      formData.append("file", file);
    }

    const res = await updateUserDetails(formData);

    if (res) {
      displayAlert("Successfully Updated", true);
    }

    setLoading(false);
  };

  useEffect(() => {
    setEmail(data?.user.email as string);
    setImage(data?.user.image as string);
    setName(data?.user.name as string);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <MaxWidthWrapper>
      <form onSubmit={updateUserProfile} className=" flex flex-col gap-6 mb-10">
        <p>Profile Picture:</p>
        {data?.user.image || image ? (
          <Image
            className=" w-[100px] h-[100px] rounded-full border-2 p-2"
            src={image ? image : (data?.user.image as string)}
            width={100}
            height={100}
            alt="Profile Picture"
          />
        ) : (
          <div className="w-[100px] h-[100px] text-4xl font-semibold rounded-full border-2 p-2 flex justify-center items-center bg-slate-400">
            <span> {data?.user.name?.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div>
          <label
            htmlFor="file_input"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Upload New
          </label>
          <input
            className=" mt-2 py-1.5 px-4 block w-full text-sm text-white rounded-md cursor-pointer bg-btn-orange focus:outline-none"
            id="file_input"
            type="file"
            accept=".svg,.png,.jpg"
            onChange={setPreviewImage}
          />
        </div>

        <div className="sm:col-span-2 sm:col-start-1">
          <label
            htmlFor="Name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <CustomInput
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              name="Name"
              id="Name"
              autoComplete="Name"
            />
          </div>
        </div>
        <div className="sm:col-span-2 sm:col-start-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            email
          </label>
          <div className="mt-2">
            <CustomInput
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="email"
              id="email"
              autoComplete="email"
            />
          </div>
        </div>
        <CustomButton isLoading={loading} disabled={loading} type="submit">
          Save
        </CustomButton>
      </form>
    </MaxWidthWrapper>
  );
};

export default Dashboard;
