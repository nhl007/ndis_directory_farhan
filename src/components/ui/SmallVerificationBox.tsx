import { cn } from "@/utils/utils";

const SmallVerificationBox = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      {...props}
      className={cn(
        "flex gap-2 px-4 font-medium rounded-md text-md py-2 bg-yellow-100 justify-center items-center w-fit",
        className
      )}
    >
      {children}
    </p>
  );
};

export default SmallVerificationBox;
