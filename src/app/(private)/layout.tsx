import type { LayoutChildrenProps } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header/Header";

const PrivateLayout = async ({ children }: LayoutChildrenProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
    </>
  );
};

export default PrivateLayout;
