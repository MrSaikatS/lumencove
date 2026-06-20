import type { LayoutChildrenProps } from "@/lib/types";

const PrivateLayout = async ({ children }: LayoutChildrenProps) => {
  return <main className="">{children}</main>;
};

export default PrivateLayout;
