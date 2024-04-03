import { logout } from "@/actions/logout";
import RegularButton from "@/components/buttons/RegularButton";

export const LogOutButton = ({ type = "button" }) => {
  return type === "button" ? (
    <RegularButton styles={`w-full`} handleClick={() => logout()}>
      Logout
    </RegularButton>
  ) : (
    <button onClick={() => logout()}>Logout</button>
  );
};
