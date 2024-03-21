import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

const NewVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex justify-center items-center w-full h-screen">
        <NewVerificationForm />
      </div>
    </Suspense>
  );
};

export default NewVerificationPage;
