"use client";

import { useFeatureContext } from "@/context/feature/FeatureContext";
import { cn } from "@/utils/utils";

function Alert({ className }: { className?: string }) {
  const {
    state: { alertSuccess, alertText },
  } = useFeatureContext();
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 py-2 px-3 text-lg flex text-white justify-center items-center rounded-lg z-50",
        alertSuccess ? "bg-green-500" : "bg-red-600",
        className
      )}
    >
      <p>{alertText}</p>
    </div>
  );
}

export default Alert;
