"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModal = () => {
  const router = useRouter();

  return (
    <button className="h-6 w-6 p-0 rounded-md" onClick={() => router.back()}>
      <X aria-label="close modal" className="h-4 w-4" />
    </button>
  );
};

export default CloseModal;
