// import { ResetForm } from "@/components/auth/reset-form";

import { Suspense } from "react";

const ResetPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      <div>reset</div>
    </Suspense>

    // <ResetForm />
  );
};

export default ResetPage;
