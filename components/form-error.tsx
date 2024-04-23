import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-lg flex items-center gap-x-2 text-sm text-destructive bg-red-100 text-red-500 shadow">
      <ExclamationTriangleIcon className="h-6 w-1/6" />
      <p className="text-sm">{message}</p>
    </div>
  );
};
