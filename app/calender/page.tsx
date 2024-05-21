import Calender from "@/components/calender/Calender";
import PageWrapper from "@/components/wrapper/PageWrapper";

import React from "react";

export default async function CalenderPage() {
  return (
    <PageWrapper>
      <div className="flex justify-center items-center">
        <Calender />
      </div>
    </PageWrapper>
  );
}
