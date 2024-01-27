"use client";
import { FormEvent, SetStateAction, useState } from "react";
import { Star, X } from "lucide-react";
import Link from "next/link";
import CustomInput from "./ui/CustomInput";
import CustomButton from "./ui/CustomButton";
import { postBusinessReview } from "@/actions/businessActions";
import Alert from "./Alert";
import { useFeatureContext } from "@/context/feature/FeatureContext";

interface ReviewModalProps {
  _id: string;
  user: string | number | null;
  setModal: React.Dispatch<SetStateAction<boolean>>;
}

const PostReviewModal = ({ _id, user, setModal }: ReviewModalProps) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(1);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");

  const {
    displayAlert,
    state: { showAlert },
  } = useFeatureContext();

  const reviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = await postBusinessReview({
      _id: _id,
      caption: caption,
      description: description,
      rating: rating,
      user: {
        _id: user as string,
        username: "",
      },
    });

    setLoading(false);
    if (data.success) {
      return displayAlert(data.message, true);
    } else {
      return displayAlert(data.message, false);
    }
  };
  return (
    <div className="fixed w-screen h-screen top-0 left-0 inset-0 flex justify-center items-center bg-gray-200/80">
      <button
        onClick={() => setModal(false)}
        className="absolute top-4 right-4 p-3 bg-red-400"
      >
        <X />
      </button>
      {showAlert && <Alert />}
      {user ? (
        <div className="w-full md:w-[700px] p-10 rounded-md bg-white shadow-lg">
          <h1 className=" text-2xl font-medium text-center">
            Write Your Review
          </h1>
          <form onSubmit={reviewSubmit} className=" flex flex-col gap-2">
            <div className="flex gap-2 font-medium text-lg items-center">
              Rating:
              {[...Array(5)].map((_, i) => {
                return (
                  <Star
                    key={i}
                    size={20}
                    fill={i < rating ? "black" : "white"}
                    onClick={() => setRating(i + 1)}
                    className="rounded-sm cursor-pointer"
                  />
                );
              })}
            </div>
            <CustomInput
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              name="caption"
              required
              placeholder="caption"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
              name="description"
              required
              placeholder="description"
            />
            <CustomButton isLoading={loading}>Submit</CustomButton>
          </form>
        </div>
      ) : (
        <p>
          Please Sign In to post a review!
          <Link
            className=" px-4 py-2 ml-2 bg-txt-blue text-white rounded-md"
            href="/sign-in"
          >
            Sign In
          </Link>
        </p>
      )}
    </div>
  );
};

export default PostReviewModal;
