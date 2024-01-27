"use client";
import { cn } from "@/utils/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CustomDropdown = ({
  name,
  className,
  children,
  ...props
}: {
  name: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-2 py-4 border-b", className)}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center cursor-pointer"
      >
        <span className="font-semibold">{name}</span>
        <ChevronDown />
      </div>
      {open ? <div>{children}</div> : null}
    </div>
  );
};

export default CustomDropdown;
