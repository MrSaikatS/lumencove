import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
};

const ResetPasswordPage = async (props: {
  searchParams: Promise<{ token?: string }>;
}) => {
  const { token } = await props.searchParams;

  if (!token) {
    redirect("/");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <p className="text-muted-foreground text-sm">
          Enter your new password below
        </p>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>

      <CardFooter>
        <p className="text-muted-foreground text-sm">
          <Link
            href="/"
            className="text-primary font-medium underline-offset-2 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordPage;
