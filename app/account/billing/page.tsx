import Header from "@/components/profile/Header";
import styles from "@/components/profile/profile.module.css";
import { getUserSubscriptionInfo } from "@/lib/userDb";
import UserPlan from "@/components/billing/UserPlan";
import { UserType } from "@/types/UserSettingTypes";
const getUserSubInfo = async () => {
  const user = await getUserSubscriptionInfo();
  return user as UserType;
};

export default async function Profile() {
  const user = await getUserSubInfo();
  console.log(user);

  return (
    <div className={`${styles.layout} gap-6 w-full justify-start`}>
      <Header />
      <div className="flex justify-center w-full">
        <UserPlan user={user} />
      </div>
    </div>
  );
}
