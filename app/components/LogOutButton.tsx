import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LogOutButton = () => {
  const router = useRouter();
  //   const isProduction = process.env.NODE_ENV === "production";
  //   const url = isProduction
  //     ? "https://deadendbooks.org"
  //     : "http://localhost:3000/home";

  const signout = async () => {
    await signOut({ callbackUrl: "http://localhost:3000/" });
  };

  return (
    <button
      className={`hover:line-through text-md
     mr-2`}
      onClick={() => signout()}
    >
      Logout
    </button>
  );
};
