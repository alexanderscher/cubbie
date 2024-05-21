import { getStripeProducts } from "@/actions/stripe/getProducts";
import { auth } from "@/auth";
import Header from "@/components/profile/Header";
import { Session } from "@/types/Session";
import styles from "@/components/profile/profile.module.css";
import { getUserSubscriptionInfo } from "@/lib/userDb";
import UserPlan from "@/components/billing/UserPlan";
const getUserSubInfo = async () => {
  const user = await getUserSubscriptionInfo();
  return user;
};

export default async function Profile() {
  // const prices = await getStripeProducts();
  // const session = (await auth()) as Session;
  // console.log(prices);
  const user = await getUserSubInfo();

  return (
    <div
      className={`${styles.layout} gap-6 w-full justify-center items center `}
    >
      <Header />
      <UserPlan user={user} />
    </div>
  );
}
