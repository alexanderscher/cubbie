import { ResetForm } from "@/components/auth/reset-form";
import { Suspense } from "react";

const ResetPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
};

export default ResetPage;
