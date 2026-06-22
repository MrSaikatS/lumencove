import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

const ForgotPasswordPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Forgot password</CardTitle>
        <p className="text-muted-foreground text-sm">
          We&apos;ll send you a link to reset it
        </p>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm />
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-center text-sm">
          Remember your password?{" "}
          <Link
            href="/"
            className="text-primary font-medium underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordPage;
