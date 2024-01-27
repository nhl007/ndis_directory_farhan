import { cn } from "@/utils/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const CustomInput = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={cn(
        "block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6",
        className
      )}
    />
  );
};

export default CustomInput;
