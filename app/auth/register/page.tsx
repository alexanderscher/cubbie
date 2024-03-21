import { RegisterForm } from "@/components/auth/register-form";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full h-screen flex justify-center items-center">
        <RegisterForm />
      </div>
    </Suspense>
  );
};

export default RegisterPage;
