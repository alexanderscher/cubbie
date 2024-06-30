import Header from "@/components/profile/Header";
import styles from "@/components/profile/profile.module.css";
import { getUserSubscriptionInfo } from "@/lib/userDb";
import UserPlan from "@/components/billing/UserPlan";
import { UserType } from "@/types/UserSettingTypes";
import { getApiUsage } from "@/actions/rateLimit/gpt";
import { auth } from "@/auth";
import { Session } from "@/types/Session";
const getUserSubInfo = async () => {
  const user = await getUserSubscriptionInfo();
  return user as UserType;
};
const apiUsage = async (id: string, planId: string) => {
  const usage = await getApiUsage(id, planId);
  return usage;
};

export default async function Profile() {
  const session = (await auth()) as Session;
  const userId = session?.user?.id;
  const planId = session?.user?.planId;
  const user = await getUserSubInfo();
  const api = await apiUsage(userId, planId);
  console.log("usage", api);

  return (
    <div className={`${styles.layout} gap-6 w-full justify-start`}>
      <Header />
      <div className="flex justify-center w-full">
        <UserPlan user={user} />
      </div>
    </div>
  );
}
