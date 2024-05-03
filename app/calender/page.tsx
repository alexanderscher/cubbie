import { auth } from "@/auth";
import Calender from "@/components/calender/Calender";
import PageWrapper from "@/components/wrapper/PageWrapper";

import { Session } from "@/types/Session";
import React from "react";

export default async function CalenderPage() {
  const session = (await auth()) as Session;

  return (
    <PageWrapper>
      <div className="flex justify-center items-center">
        <Calender timezone={session.user.timezone} />
      </div>
    </PageWrapper>
  );
}
