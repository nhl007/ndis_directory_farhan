"use client";

import { useState } from "react";
import BorderBox from "./ui/BorderBox";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostReviewModal from "./PostReviewModal";
import { Star } from "lucide-react";
import { BusinessReviewData } from "@/types/business";

const Reviews = ({
  _id,
  reviewsData,
  total,
  rating,
}: {
  _id: string;
  total: number;
  rating: number;
  reviewsData: Omit<BusinessReviewData, "_id">[];
}) => {
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const { data } = useSession();

  const openReviewModal = () => {
    if (data === null) {
      router.push("/sign-in");
    }
    setModal((prev) => !prev);
  };

  return (
    <BorderBox className="flex flex-col mt-6 gap-4">
      <button
        onClick={openReviewModal}
        className="px-5 py-2 text-lg border-2 self-end mt-2 border-txt-blue rounded-md "
      >
        Write a review
      </button>
      {modal && (
        <PostReviewModal
          setModal={setModal}
          user={data?.user.id ?? null}
          _id={_id}
        />
      )}

      <h1 className=" text-2xl font-medium">Reviews</h1>
      <p className="flex font-semibold items-center gap-1">
        {rating.toFixed(2)} <Star size={18} /> - {total} reviews
      </p>
      {reviewsData.map((review, i) => {
        return (
          <div
            className="flex md:flex-row flex-col md:gap-6 gap-1 border-b pb-3"
            key={i}
          >
            <div className="min-w-[100px]">
              <p className=" text-lg font-medium">{review.user.username}</p>
              <p className=" text-sm md:mt-2">{review.date.slice(0, 10)}</p>
            </div>
            <div className="flex flex-col gap-0 mt-2 md:mt-0 md:gap-2">
              <p className="text-xl font-medium  ">{review.caption}</p>
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star size={18} key={i} />
                ))}
              </div>
              <p className="text-sm line-clamp-3 break-words">
                {review.description}
              </p>
            </div>
          </div>
        );
      })}
    </BorderBox>
  );
};

export default Reviews;
