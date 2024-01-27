import { cn } from "@/utils/utils";

interface BorderBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const BorderBox = ({ children, className, ...props }: BorderBoxProps) => {
  return (
    <div
      {...props}
      className={cn(
        "p-[20px] rounded-xl border-[0.5px] border-gray-500",
        className
      )}
    >
      {children}
    </div>
  );
};

export default BorderBox;
