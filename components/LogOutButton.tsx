import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";

export const LogOutButton = () => {
  const router = useRouter();

  return (
    <button
      className={`hover:line-through text-md
     mr-2`}
      onClick={() => logout()}
    >
      Logout
    </button>
  );
};
