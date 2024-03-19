import PageWrapper from "@/app/components/wrapper/PageWrapper";
import { LayoutProps } from "@/types/receiptTypes";

const layout = async ({ children }: LayoutProps) => {
  return <PageWrapper>{children}</PageWrapper>;
};

export default layout;
