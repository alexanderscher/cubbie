import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex justify-center items-center w-full h-screen">
        <LoginForm />
      </div>
    </Suspense>
  );
};

export default LoginPage;
