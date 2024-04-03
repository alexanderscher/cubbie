import PageWrapper from "@/components/wrapper/PageWrapper";
import { LayoutProps } from "@/types/AppTypes";

import React from "react";

const layout = ({ children }: LayoutProps) => {
  return <PageWrapper>{children}</PageWrapper>;
};

export default layout;
